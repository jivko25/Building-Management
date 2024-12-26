const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");

const createInvoice = async (req, res, next) => {
  console.log("Creating new invoice...");
  try {
    const { company_id, client_company_name, client_name, client_company_address, client_company_iban, client_emails, due_date_weeks, items } = req.body;

    // Създаване или намиране на клиент
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

    // Останалата логика за създаване на фактура
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

    // Създаване на елементите на фактурата
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

    // Генериране на PDF
    const pdfBuffer = await createInvoicePDF(invoice.id);

    // Изпращане на имейли
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
          attributes: ["name", "address", "number"]
        },
        {
          model: Company,
          as: "clientCompany",
          attributes: ["name", "address", "number"]
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
          attributes: ["name", "address", "number", "iban", "vat_number", "logo_url"]
        },
        {
          model: Company,
          as: "clientCompany",
          attributes: ["name", "address", "number", "iban", "email"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity"
            },
            {
              model: Measure,
              as: "measure"
            },
            {
              model: Project,
              as: "project"
            },
            {
              model: Task,
              as: "task"
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

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById
};
