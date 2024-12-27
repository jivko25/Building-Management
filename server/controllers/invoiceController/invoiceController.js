const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");

const createInvoice = async (req, res, next) => {
  console.log("Creating new invoice...");
  try {
    const { company_id, client_company_name, client_name, client_company_address, client_company_iban, client_emails, due_date_weeks, items } = req.body;

    // Create or find client
    const [client] = await Client.findOrCreate({
      where: { client_name },
      defaults: {
        client_company_name,
        client_company_address,
        client_company_iban,
        client_emails: Array.isArray(client_emails) ? client_emails : [client_emails]
      }
    });

    console.log("Client created/found:", client.id);

    // Create invoice number
    const date = new Date();
    const year = date.getFullYear();
    const week = Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 604800000);

    const lastInvoice = await Invoice.count({
      where: { year, week_number: week }
    });

    const invoice_number = `${year}-${week}/52-${lastInvoice + 1}`;
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + due_date_weeks * 7);

    const total_amount = items.reduce((sum, item) => sum + item.quantity * item.price_per_unit, 0);

    const invoice = await Invoice.create({
      invoice_number,
      year,
      week_number: week,
      company_id,
      client_id: client.id,
      invoice_date: date,
      due_date,
      total_amount,
      paid: false
    });

    console.log("Invoice created:", invoice.invoice_number);

    // Create invoice items
    const invoiceItems = await Promise.all(
      items.map(item =>
        InvoiceItem.create({
          invoice_id: invoice.id,
          ...item,
          total_price: item.quantity * item.price_per_unit
        })
      )
    );

    console.log("Invoice items created");

    // Generate PDF
    const pdfBuffer = await createInvoicePDF(invoice.id);

    // Send emails
    const emailList = Array.isArray(client_emails) ? client_emails : [client_emails];

    console.log("Sending invoice to emails:", emailList);

    for (const email of emailList) {
      await sendInvoiceEmail(email, pdfBuffer, invoice_number);
      console.log("Invoice email sent to:", email);
    }

    res.status(201).json({
      success: true,
      data: {
        invoice,
        items: invoiceItems
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
              attributes: ["id", "name", "address"]
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
              attributes: ["id", "name", "address"]
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
                  attributes: ["id", "name", "address"]
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

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  deleteInvoice,
  updateInvoice
};
