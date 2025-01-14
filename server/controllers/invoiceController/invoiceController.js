const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client, WorkItem, InvoiceLanguage } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");
const { sequelize } = require("../../data/index.js");

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
        isInvoiced: false
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
  console.log("Deleting invoice with ID:", req.params.id);
  try {
    // Find invoice to check if it exists
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: InvoiceItem,
          as: "items"
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

    // Delete all invoice items
    await Promise.all(
      invoice.items.map(async item => {
        console.log("Deleting invoice item:", item.id);
        await item.destroy();
      })
    );

    console.log("All invoice items deleted");

    // Delete invoice
    await invoice.destroy();
    console.log("Invoice deleted successfully");

    res.status(200).json({
      success: true,
      message: "Invoice and related items deleted successfully",
      data: {
        invoice_number: invoice.invoice_number
      }
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
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

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  getInvoicePDF,
  updateInvoiceStatus,
  generateUniqueInvoiceNumber
};
