const db = require("../../../data/index.js");
const { Invoice, Artisan, Company, InvoiceItem, Activity, Measure, User } = db;

const getArtisanInvoiceById = async (req, res) => {
  try {
    console.log("Fetching artisan invoice with ID:", req.params.id);

    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
      },
      attributes: ["id", "invoice_number", "invoice_date", "due_date", "total_amount", "paid"],
      include: [
        {
          model: Artisan,
          as: "artisan",
          attributes: ["id", "name", "note", "email", "number"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "email"]
            }
          ]
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "address", "email"]
        },
        {
          model: InvoiceItem,
          as: "items",
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "name"]
            },
            {
              model: Measure,
              as: "measure",
              attributes: ["id", "name"]
            }
          ]
        }
      ]
    });

    if (!invoice) {
      console.log("Artisan invoice not found");
      return res.status(404).json({
        success: false,
        message: "Artisan invoice not found"
      });
    }

    console.log("Found artisan invoice:", invoice.id);

    const formattedInvoice = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      total_amount: invoice.total_amount,
      paid: invoice.paid,
      artisan: {
        id: invoice.artisan.id,
        name: invoice.artisan.name,
        email: invoice.artisan.email,
        number: invoice.artisan.number,
        note: invoice.artisan.note,
        manager: invoice.artisan.user
          ? {
              id: invoice.artisan.user.id,
              full_name: invoice.artisan.user.full_name,
              email: invoice.artisan.user.email
            }
          : null
      },
      company: {
        id: invoice.company.id,
        name: invoice.company.name,
        address: invoice.company.address,
        email: invoice.company.email
      },
      items: invoice.items.map(item => ({
        id: item.id,
        activity: {
          id: item.activity.id,
          name: item.activity.name
        },
        measure: {
          id: item.measure.id,
          name: item.measure.name
        },
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
        total_price: item.total_price
      }))
    };

    res.json({
      success: true,
      data: formattedInvoice
    });
  } catch (error) {
    console.error("Error fetching artisan invoice:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getArtisanInvoiceById };
