const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client, WorkItem, InvoiceLanguage, Artisan, DefaultPricing } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator.js");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService.js");
const { sequelize } = require("../../data/index.js");
const { createArtisanInvoicePDF } = require("../../utils/pdfGenerator.js");

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
        is_artisan_invoiced: false
      },
      include: [
        {
          model: Task,
          as: "task",
          include: [{ model: Project, as: "project" }]
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

    // Вземаме цените от DefaultPricing
    const defaultPricing = await DefaultPricing.findOne({
      where: {
        project_id: workItems[0].task.project.id,
        activity_id: workItems[0].activity_id,
        measure_id: workItems[0].measure_id
      }
    });

    if (!defaultPricing) {
      throw new Error("Default pricing not found for this combination");
    }

    // Изчисляваме общата сума използвайки artisan_price от DefaultPricing
    const total_amount = workItems.reduce((sum, item) => sum + defaultPricing.artisan_price * item.quantity, 0);

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
      workItems.map(item =>
        InvoiceItem.create(
          {
            invoice_id: invoice.id,
            work_item_id: item.id,
            project_id: item.task.project.id,
            activity_id: item.activity_id,
            measure_id: item.measure_id,
            quantity: item.quantity,
            price_per_unit: defaultPricing.artisan_price,
            total_price: item.quantity * defaultPricing.artisan_price
          },
          { transaction: t }
        )
      )
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
  updateInvoiceStatus,
  generateUniqueInvoiceNumber,
  createArtisanInvoice,
  getArtisanInvoicePDF,
  updateArtisanInvoice,
  deleteArtisanInvoice
};
