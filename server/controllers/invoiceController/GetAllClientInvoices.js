const db = require("../../data/index.js");
const { Invoice, Company, Client, InvoiceItem, Activity, Measure, Project } = db;

const getAllClientInvoices = async (req, res, next) => {
  console.log("Fetching all client invoices...");
  try {
    const invoices = await Invoice.findAll({
      where: {
        is_artisan_invoice: false
      },
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

    console.log(`Found ${invoices.length} client invoices`);
    res.status(200).json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    next(error);
  }
};

module.exports = { getAllClientInvoices };
