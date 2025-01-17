const db = require("../../../data/index.js");
const { Invoice, Artisan, Company, InvoiceItem, Activity, Measure } = db;

const getArtisanInvoiceById = async (req, res) => {
  try {
    console.log("Fetching artisan invoice with ID:", req.params.id);

    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: true
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
      artisan: invoice.artisan
        ? {
            id: invoice.artisan.id,
            name: invoice.artisan.name,
            email: invoice.artisan.email,
            number: invoice.artisan.number,
            note: invoice.artisan.note
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
      items: invoice.items
        ? invoice.items.map(item => ({
            id: item.id,
            activity: item.activity
              ? {
                  id: item.activity.id,
                  name: item.activity.name
                }
              : null,
            measure: item.measure
              ? {
                  id: item.measure.id,
                  name: item.measure.name
                }
              : null,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
            total_price: item.total_price
          }))
        : [],
      total_amount: invoice.total_amount,
      status: invoice.status,
      due_date: invoice.due_date,
      created_at: invoice.created_at
    };

    console.log("Formatted invoice:", JSON.stringify(formattedInvoice, null, 2));

    res.status(200).json({
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
