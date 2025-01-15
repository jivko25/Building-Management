const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client, WorkItem, InvoiceLanguage, Artisan } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");
const { sequelize } = require("../../data/index.js");
const { createArtisanInvoicePDF } = require("../../utils/pdfGenerator");

const getWeekNumber = date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return {
    week: weekNumber,
    year: d.getFullYear()
  };
};

const generateUniqueInvoiceNumber = async (year, week) => {
  console.log("Generating unique invoice number for year:", year, "week:", week);

  // Намираме последната фактура за тази година и седмица
  const lastInvoice = await Invoice.findOne({
    where: {
      year,
      week_number: week
    },
    order: [["created_at", "DESC"]]
  });

  // Ако няма фактура за тази седмица, започваме от 1
  const lastNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split("-").pop()) : 0;
  const newNumber = lastNumber + 1;

  // Форматираме номера: YYYY-WW/WW-N
  // Например: 2024-12/12-1
  const invoiceNumber = `${year}-${week.toString().padStart(2, "0")}/${week.toString().padStart(2, "0")}-${newNumber}`;

  console.log("Generated invoice number:", invoiceNumber);
  return invoiceNumber;
};

const createInvoice = async (req, res, next) => {
  console.log("Creating invoice with data:", req.body);
  const t = await sequelize.transaction();

  try {
    const { company_id, client_company_id, due_date_weeks, selected_projects, selected_work_items } = req.body;

    // Validate required fields
    if (!company_id || !client_company_id || !due_date_weeks || !selected_work_items?.length) {
      console.error("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          company_id: !company_id,
          client_company_id: !client_company_id,
          due_date_weeks: !due_date_weeks,
          selected_work_items: !selected_work_items?.length
        }
      });
    }

    // Get client company details with invoice language
    const client = await Client.findByPk(client_company_id, {
      include: [
        {
          model: InvoiceLanguage,
          as: "invoiceLanguage",
          attributes: ["code", "name"]
        }
      ]
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client company not found"
      });
    }

    console.log("Client invoice language:", client.invoiceLanguage?.code || "en");

    const workItems = await WorkItem.findAll({
      where: {
        id: selected_work_items,
        is_client_invoiced: false
      },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Project,
              as: "project",
              where: {
                id: selected_projects
              }
            }
          ]
        },
        {
          model: Activity,
          as: "activity"
        },
        {
          model: Measure,
          as: "measure"
        }
      ]
    });

    // Check if any work items are already invoiced
    const clientWorkItems = await WorkItem.findAll({
      where: {
        id: selected_work_items
      }
    });

    // Проверяваме дали има поне един работен елемент, който вече е фактуриран
    const alreadyInvoicedItems = clientWorkItems.filter(item => item.is_client_invoiced === true);

    if (alreadyInvoicedItems.length > 0) {
      console.error(
        "Some work items are already invoiced:",
        alreadyInvoicedItems.map(item => item.id)
      );
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Cannot create invoice. Some work items are already invoiced.",
        details: {
          invoiced_items: alreadyInvoicedItems.map(item => item.id),
          total_selected: clientWorkItems.length,
          already_invoiced: alreadyInvoicedItems.length
        }
      });
    }

    // Проверяваме дали всички избрани работни елементи са намерени
    if (clientWorkItems.length !== selected_work_items.length) {
      console.error("Not all selected work items were found");
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Some selected work items were not found",
        details: {
          selected: selected_work_items,
          found: clientWorkItems.map(item => item.id)
        }
      });
    }

    // Групиране на работните елементи по дейност, мярка и проект
    const groupedItems = {};
    let totalAmount = 0;

    workItems.forEach(item => {
      const key = `${item.activity_id}-${item.measure_id}-${item.task.project.id}`;

      if (!groupedItems[key]) {
        groupedItems[key] = {
          activity_id: item.activity_id,
          measure_id: item.measure_id,
          project_id: item.task.project.id,
          task_id: item.task_id,
          quantity: 0,
          // Използваме manager_price от workitem вместо price_per_measure от task
          price_per_unit: parseFloat(item.manager_price)
        };
      }

      groupedItems[key].quantity += parseFloat(item.quantity);
      // Изчисляваме общата сума използвайки manager_price
      totalAmount += parseFloat(item.quantity) * parseFloat(item.manager_price);
    });

    // Get current date info
    const date = new Date();
    const year = date.getFullYear();
    const week = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));

    // Calculate due date
    const due_date = new Date(date);
    due_date.setDate(due_date.getDate() + due_date_weeks * 7);

    // Create invoice with total_amount
    const invoice = await Invoice.create({
      company_id,
      client_id: client_company_id,
      invoice_number: await generateUniqueInvoiceNumber(year, week),
      year,
      week_number: week,
      invoice_date: date,
      due_date,
      total_amount: totalAmount,
      paid: false
    });

    // Create invoice items
    const items = await Promise.all(
      Object.values(groupedItems).map(async item => {
        console.log("Creating invoice item with data:", item);

        return InvoiceItem.create({
          invoice_id: invoice.id,
          activity_id: item.activity_id,
          measure_id: item.measure_id,
          project_id: item.project_id,
          task_id: item.task_id,
          quantity: item.quantity,
          price_per_unit: item.price_per_unit,
          total_price: item.quantity * item.price_per_unit
        });
      })
    );

    console.log("Invoice created successfully");

    // Генерираме PDF с правилния език
    const pdfBuffer = await createInvoicePDF(invoice.id, client.invoice_language_id);
    console.log("PDF generated successfully");

    // Вземаме имейлите на клиента
    const clientEmails = client.client_emails;
    if (clientEmails && clientEmails.length > 0) {
      console.log("Sending invoice emails to:", clientEmails);

      // Изпращаме имейл до всеки адрес с правилния език
      for (const email of clientEmails) {
        await sendInvoiceEmail(email, pdfBuffer, invoice.invoice_number, client.invoice_language_id);
        console.log("Invoice email sent to:", email);
      }
    } else {
      console.log("No client emails found to send invoice to");
    }

    // Mark work items as invoiced
    await Promise.all(workItems.map(item => item.update({ is_client_invoiced: true }, { transaction: t })));

    await t.commit();
    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating invoice:", error);
    next(error);
  }
};

const getAllInvoices = async (req, res, next) => {
  console.log("Fetching all invoices...");
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "registration_number", "vat_number", "iban", "phone"]
        },
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "name", "status"]
            },
            {
              model: Measure,
              as: "measure",
              attributes: ["id", "name"]
            },
            {
              model: Project,
              as: "project",
              attributes: ["id", "name", "address", "location"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    console.log(`Found ${invoices.length} invoices`);
    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  console.log("Fetching invoice by ID:", req.params.id);
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "registration_number", "vat_number", "iban", "logo_url", "phone", "email", "mol"]
        },
        {
          model: Client,
          as: "client",
          include: [
            {
              model: InvoiceLanguage,
              as: "invoiceLanguage",
              attributes: ["code", "name"]
            }
          ],
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails", "client_company_vat_number"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "name", "status"]
            },
            {
              model: Measure,
              as: "measure",
              attributes: ["id", "name"]
            },
            {
              model: Project,
              as: "project",
              attributes: ["id", "name", "address", "location"]
            }
          ]
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    console.log("Invoice found:", invoice.invoice_number);
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: InvoiceItem,
          as: "items"
        }
      ]
    });

    if (!invoice) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    // Get all work items related to this invoice
    const workItemIds = invoice.items.map(item => item.work_item_id);

    // Reset invoice flags based on invoice type
    if (invoice.is_artisan_invoice) {
      await WorkItem.update(
        { is_artisan_invoiced: false },
        {
          where: { id: workItemIds },
          transaction: t
        }
      );
    } else {
      await WorkItem.update(
        { is_client_invoiced: false },
        {
          where: { id: workItemIds },
          transaction: t
        }
      );
    }

    // Delete invoice items and invoice
    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id },
      transaction: t
    });

    await invoice.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully"
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  console.log("Updating invoice with ID:", req.params.id);
  try {
    const { client_company_name, client_name, client_company_address, client_company_iban, client_emails, due_date_weeks, items } = req.body;

    // Find invoice
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: InvoiceItem,
          as: "items"
        },
        {
          model: Client,
          as: "client"
        }
      ]
    });

    if (!invoice) {
      console.log("Invoice not found");
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    console.log("Found invoice:", invoice.invoice_number);

    // Update client
    const client = await Client.findByPk(invoice.client_id);
    await client.update({
      client_company_name,
      client_name,
      client_company_address,
      client_company_iban,
      client_emails: Array.isArray(client_emails) ? client_emails : [client_emails]
    });

    console.log("Client updated successfully");

    // Update due date
    if (due_date_weeks) {
      const due_date = new Date();
      due_date.setDate(due_date.getDate() + due_date_weeks * 7);
      await invoice.update({ due_date });
    }

    // Delete old items
    await Promise.all(
      invoice.items.map(async item => {
        console.log("Deleting old invoice item:", item.id);
        await item.destroy();
      })
    );

    console.log("Old invoice items deleted");

    // Create new items
    const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price_per_unit, 0);

    const invoiceItems = await Promise.all(
      items.map(item =>
        InvoiceItem.create({
          invoice_id: invoice.id,
          ...item,
          total_price: item.quantity * item.price_per_unit
        })
      )
    );

    // Update total amount
    await invoice.update({ total_amount });

    console.log("Invoice updated successfully");

    // Generate new PDF
    const pdfBuffer = await createInvoicePDF(invoice.id);

    // Send emails with updated invoice
    const emailList = Array.isArray(client_emails) ? client_emails : [client_emails];

    console.log("Sending updated invoice to emails:", emailList);

    for (const email of emailList) {
      await sendInvoiceEmail(email, pdfBuffer, invoice.invoice_number);
      console.log("Updated invoice email sent to:", email);
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: {
        invoice: await Invoice.findByPk(invoice.id, {
          include: [
            {
              model: Company,
              as: "company",
              attributes: ["name", "address", "registration_number", "vat_number", "iban", "logo_url", "phone"]
            },
            {
              model: Client,
              as: "client",
              attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails"]
            },
            {
              model: InvoiceItem,
              as: "items",
              include: [
                {
                  model: Activity,
                  as: "activity",
                  attributes: ["id", "name", "status"]
                },
                {
                  model: Measure,
                  as: "measure",
                  attributes: ["id", "name"]
                },
                {
                  model: Project,
                  as: "project",
                  attributes: ["id", "name", "address", "location"]
                }
              ]
            }
          ]
        })
      }
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    next(error);
  }
};

const getInvoicePDF = async (req, res, next) => {
  console.log("Generating PDF for invoice ID:", req.params.id);
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["invoice_language_id"]
        }
      ]
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const pdfBuffer = await createInvoicePDF(req.params.id, invoice.client.invoice_language_id);

    // Set correct headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${req.params.id}.pdf"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send buffer directly
    res.end(pdfBuffer);

    console.log("PDF sent successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    next(error);
  }
};

const updateInvoiceStatus = async (req, res, next) => {
  console.log("Updating invoice status:", req.params.id);
  try {
    const invoice = await Invoice.findByPk(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    await invoice.update({ paid: req.body.paid });

    console.log("Invoice status updated successfully");

    res.status(200).json({
      success: true,
      message: "Invoice status updated successfully",
      data: await Invoice.findByPk(invoice.id, {
        include: [
          {
            model: Company,
            as: "company",
            attributes: ["name", "address", "registration_number", "vat_number", "iban", "logo_url", "phone"]
          },
          {
            model: Client,
            as: "client",
            attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails"]
          }
        ]
      })
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    next(error);
  }
};

const createArtisanInvoice = async (req, res, next) => {
  console.log("Creating artisan invoice with data:", req.body);
  const t = await sequelize.transaction();

  try {
    const { company_id, artisan_id, due_date_weeks, selected_work_items } = req.body;

    // Check if any work items are already invoiced for artisan
    const artisanWorkItems = await WorkItem.findAll({
      where: {
        id: selected_work_items,
        artisan_id: artisan_id
      }
    });

    const alreadyInvoicedItems = artisanWorkItems.filter(item => item.is_artisan_invoiced);

    if (alreadyInvoicedItems.length > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Some work items are already invoiced for this artisan",
        details: alreadyInvoicedItems.map(item => item.id)
      });
    }

    // Get artisan details first
    const artisan = await Artisan.findByPk(artisan_id, {
      include: [
        {
          model: Company,
          as: "company"
        }
      ]
    });

    if (!artisan) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Artisan not found"
      });
    }

    console.log("Found artisan:", {
      id: artisan.id,
      name: artisan.name,
      email: artisan.email
    });

    // Validate required fields
    if (!company_id || !artisan_id || !due_date_weeks || !selected_work_items?.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Get current date info
    const currentDate = new Date();
    const { week, year } = getWeekNumber(currentDate);

    // Generate invoice number
    const invoiceNumber = await generateUniqueInvoiceNumber(year, week);

    // Calculate due date
    const dueDate = new Date(currentDate);
    dueDate.setDate(dueDate.getDate() + due_date_weeks * 7);

    // Get work items with all necessary relations
    const workItems = await WorkItem.findAll({
      where: {
        id: selected_work_items,
        artisan_id,
        status: "in_progress",
        is_client_invoiced: false
      },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Project,
              as: "project"
            }
          ]
        },
        {
          model: Activity,
          as: "activity"
        },
        {
          model: Measure,
          as: "measure"
        }
      ],
      transaction: t
    });

    console.log("Found work items:", {
      count: workItems.length,
      items: workItems.map(item => ({
        id: item.id,
        artisan_id: item.artisan_id,
        status: item.status,
        is_client_invoiced: item.is_client_invoiced
      }))
    });

    if (!workItems.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "No valid work items found for the selected artisan"
      });
    }

    // Calculate total amount
    const total_amount = workItems.reduce((sum, item) => sum + item.artisan_price * item.quantity, 0);

    // Create invoice
    const invoice = await Invoice.create(
      {
        invoice_number: invoiceNumber,
        year,
        week_number: week,
        company_id,
        invoice_date: currentDate,
        due_date: dueDate,
        total_amount: total_amount,
        is_artisan_invoice: true,
        artisan_id
      },
      { transaction: t }
    );

    // Create invoice items
    const invoiceItems = await Promise.all(
      workItems.map(async workItem => {
        console.log("Creating invoice item from work item:", {
          workItemId: workItem.id,
          artisanPrice: workItem.artisan_price,
          quantity: workItem.quantity
        });

        const invoiceItem = await InvoiceItem.create(
          {
            invoice_id: invoice.id,
            activity_id: workItem.activity_id,
            measure_id: workItem.measure_id,
            project_id: workItem.task.project.id,
            task_id: workItem.task_id,
            quantity: workItem.quantity,
            price_per_unit: workItem.artisan_price,
            total_price: workItem.artisan_price * workItem.quantity
          },
          { transaction: t }
        );

        // Mark work item as invoiced
        await workItem.update({ is_client_invoiced: true }, { transaction: t });

        return invoiceItem;
      })
    );

    // Mark work items as artisan invoiced
    await Promise.all(workItems.map(item => item.update({ is_artisan_invoiced: true }, { transaction: t })));

    await t.commit();

    // Generate PDF after commit
    try {
      const pdfBuffer = await createArtisanInvoicePDF(invoice.id);
      console.log("PDF generated successfully");

      // Send email if artisan has email
      if (artisan.email) {
        console.log("Sending invoice email to artisan:", artisan.email);
        await sendInvoiceEmail(artisan.email, pdfBuffer, invoice.invoice_number);
        console.log("Invoice email sent successfully");
      } else {
        console.log("No email address found for artisan");
      }
    } catch (error) {
      console.error("Error with PDF/email generation:", error);
      // Don't throw error here, just log it
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Artisan invoice created successfully",
      data: invoice
    });
  } catch (error) {
    console.error("Error creating artisan invoice:", error);
    if (t && !t.finished) {
      await t.rollback();
    }
    next(error);
  }
};

const getArtisanInvoicePDF = async (req, res, next) => {
  console.log("Getting artisan invoice PDF for ID:", req.params.id);
  try {
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Artisan invoice not found"
      });
    }

    const pdfBuffer = await createArtisanInvoicePDF(invoice.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=artisan-invoice-${invoice.invoice_number}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error getting artisan invoice PDF:", error);
    next(error);
  }
};

const updateArtisanInvoice = async (req, res, next) => {
  console.log("Updating artisan invoice:", req.params.id);
  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Artisan invoice not found"
      });
    }

    const { paid } = req.body;
    await invoice.update({ paid }, { transaction: t });

    await t.commit();
    res.json({
      success: true,
      message: "Artisan invoice updated successfully",
      data: invoice
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating artisan invoice:", error);
    next(error);
  }
};

const deleteArtisanInvoice = async (req, res, next) => {
  console.log("Deleting artisan invoice:", req.params.id);
  const t = await sequelize.transaction();

  try {
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Artisan invoice not found"
      });
    }

    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id },
      transaction: t
    });

    await invoice.destroy({ transaction: t });

    await t.commit();
    res.json({
      success: true,
      message: "Artisan invoice deleted successfully"
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting artisan invoice:", error);
    next(error);
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  getInvoicePDF,
  updateInvoiceStatus,
  generateUniqueInvoiceNumber,
  createArtisanInvoice,
  getArtisanInvoicePDF,
  updateArtisanInvoice,
  deleteArtisanInvoice
};
