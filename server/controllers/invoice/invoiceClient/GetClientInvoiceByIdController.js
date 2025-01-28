const db = require("../../../data/index.js");
const { Invoice, Company, Client, InvoiceItem, Activity, Measure, Project, InvoiceLanguage } = db;

const getClientInvoiceById = async (req, res, next) => {
  console.log("Fetching client invoice by ID:", req.params.id);
  try {
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: false
      },
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
        message: "Client invoice not found"
      });
    }

    console.log("Client invoice found:", invoice.invoice_number);
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error("Error fetching client invoice:", error);
    next(error);
  }
};

module.exports = { getClientInvoiceById };
