const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");

const createInvoice = async (req, res, next) => {
  console.log("Creating new invoice with data:", JSON.stringify(req.body, null, 2));
  try {
    const { company_id, client_company_name, client_name, client_company_address, client_company_iban, client_emails, creator_id, due_date_weeks, items } = req.body;

    // Validate required fields
    if (!company_id || !client_company_name || !client_name || !creator_id || !items || !items.length) {
      console.error("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        details: {
          company_id: !company_id,
          client_company_name: !client_company_name,
          client_name: !client_name,
          creator_id: !creator_id,
          items: !items || !items.length
        }
      });
    }

    // Validate items
    for (const item of items) {
      if (!item.activity_id || !item.measure_id || !item.project_id || !item.quantity || !item.price_per_unit) {
        console.error("Invalid item data:", item);
        return res.status(400).json({
          success: false,
          message: "Invalid item data",
          details: {
            item,
            required: {
              activity_id: !item.activity_id,
              measure_id: !item.measure_id,
              project_id: !item.project_id,
              quantity: !item.quantity,
              price_per_unit: !item.price_per_unit
            }
          }
        });
      }
    }

    // Get current date info
    const date = new Date();
    const year = date.getFullYear();
    const week = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));

    // Function to generate and validate invoice number
    const generateUniqueInvoiceNumber = async () => {
      // Get all invoice numbers for current year and week
      const existingInvoices = await Invoice.findAll({
        where: { year, week_number: week },
        attributes: ["invoice_number"],
        raw: true
      });

      // Extract sequence numbers from existing invoice numbers
      const existingNumbers = existingInvoices
        .map(inv => {
          const match = inv.invoice_number.match(/(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .sort((a, b) => a - b);

      // Find first available number
      let sequenceNumber = 1;
      for (const existingNumber of existingNumbers) {
        if (existingNumber !== sequenceNumber) {
          break;
        }
        sequenceNumber++;
      }

      const proposedNumber = `${year}-${week}/${week}-${sequenceNumber}`;
      console.log("Generated invoice number:", proposedNumber);

      // Double-check uniqueness
      const isUnique =
        (await Invoice.count({
          where: { invoice_number: proposedNumber }
        })) === 0;

      if (!isUnique) {
        console.log("Number collision detected, retrying with next number");
        return generateUniqueInvoiceNumber();
      }

      return proposedNumber;
    };

    // Generate unique invoice number
    const invoice_number = await generateUniqueInvoiceNumber();
    console.log("Final invoice number:", invoice_number);

    // Calculate due date and total amount
    const due_date = new Date(date);
    due_date.setDate(due_date.getDate() + (due_date_weeks || 4) * 7);
    const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price_per_unit, 0);

    // Create or find client
    const [client] = await Client.findOrCreate({
      where: { client_name },
      defaults: {
        client_company_name,
        client_company_address,
        client_company_iban,
        client_emails: Array.isArray(client_emails) ? client_emails : [client_emails],
        creator_id
      }
    });

    console.log("Client created/found:", client.id);

    // Create invoice with transaction to ensure atomicity
    const result = await db.sequelize.transaction(async t => {
      const invoice = await Invoice.create(
        {
          invoice_number,
          year,
          week_number: week,
          company_id,
          client_id: client.id,
          invoice_date: date,
          due_date,
          total_amount,
          paid: false
        },
        { transaction: t }
      );

      // Create invoice items
      await Promise.all(
        items.map(item =>
          InvoiceItem.create(
            {
              invoice_id: invoice.id,
              ...item,
              total_price: item.quantity * item.price_per_unit
            },
            { transaction: t }
          )
        )
      );

      return invoice;
    });

    console.log("Invoice created successfully:", result.invoice_number);

    // Generate PDF
    const pdfBuffer = await createInvoicePDF(result.id);

    // Send emails
    const emailList = Array.isArray(client_emails) ? client_emails : [client_emails];

    console.log("Sending invoice to emails:", emailList);

    for (const email of emailList) {
      await sendInvoiceEmail(email, pdfBuffer, result.invoice_number);
      console.log("Invoice email sent to:", email);
    }

    res.status(201).json({
      success: true,
      data: {
        invoice: result,
        items: result.items
      }
    });
  } catch (error) {
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
          attributes: ["name", "address", "number", "vat_number", "iban", "phone"]
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
          attributes: ["name", "address", "number", "vat_number", "iban", "logo_url", "phone"]
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
            },
            {
              model: Task,
              as: "task",
              attributes: ["id", "name", "status"]
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
              attributes: ["name", "address", "number", "vat_number", "iban", "logo_url", "phone"]
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
    const pdfBuffer = await createInvoicePDF(req.params.id);

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
            attributes: ["name", "address", "number", "vat_number", "iban", "logo_url", "phone"]
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
  updateInvoiceStatus
};
