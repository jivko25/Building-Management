const db = require("../../../data/index.js");
const { Invoice, Artisan, Company } = db;

const getAllArtisanInvoices = async (req, res, next) => {
  try {
    console.log("Fetching all artisan invoices...");


    const invoices = await Invoice.findAll({
      where: {
        is_artisan_invoice: true,
        creator_id: req.user.id
      },
      include: [
        {
          model: Artisan,
          as: "artisan",
          attributes: ["id", "name", "note", "email", "number"]
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "address", "email"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    console.log(`Found ${invoices.length} artisan invoices`);

    const formattedInvoices = invoices.map(invoice => {
      console.log("Raw invoice date:", invoice.invoice_date);
      console.log("Raw due date:", invoice.due_date);

      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        artisan: invoice.artisan
          ? {
              id: invoice.artisan.id,
              name: invoice.artisan.name,
              email: invoice.artisan.email,
              number: invoice.artisan.number
            }
          : null,
        company: invoice.company
          ? {
              id: invoice.company.id,
              name: invoice.company.name,
              address: invoice.company.address,
              email: invoice.company.email
            }
          : null,
        total_amount: invoice.total_amount,
        paid: invoice.paid,
        status: invoice.status
      };
    });

    console.log("Sample formatted invoice:", JSON.stringify(formattedInvoices[0], null, 2));

    res.status(200).json({
      success: true,
      data: formattedInvoices
    });
  } catch (error) {
    console.error("Error fetching artisan invoices:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
    next(error);
  }
};

module.exports = { getAllArtisanInvoices };
