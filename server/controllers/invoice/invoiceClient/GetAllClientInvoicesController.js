const db = require("../../../data/index.js");
const { Invoice, Company, Client, InvoiceItem, Activity, Measure, Project } = db;

const getAllClientInvoices = async (req, res, next) => {
  console.log("Fetching all client invoices...");

  
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const options = {
      where: { is_artisan_invoice: false, creator_id: req.user.id },
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
    };

    if (page && limit) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    const result = await (page && limit ? Invoice.findAndCountAll(options) : Invoice.findAll(options));

    const response =
      page && limit
        ? {
            data: result.rows,
            pagination: {
              totalItems: result.count,
              totalPages: Math.ceil(result.count / limit),
              currentPage: page,
              itemsPerPage: limit
            }
          }
        : { data: result };

    res.status(200).json({
      success: true,
      ...response
    });
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    next(error);
  }
};

const getAllClientInvoicesPaginated = async (req, res, next) => {
  console.log("Fetching paginated client invoices...");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: { is_artisan_invoice: false },
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
      order: [["created_at", "DESC"]],
      limit,
      offset
    });

    console.log(`Found ${count} total client invoices`);
    res.status(200).json({
      success: true,
      data: invoices,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    next(error);
  }
};

module.exports = {
  getAllClientInvoices,
  getAllClientInvoicesPaginated
};
