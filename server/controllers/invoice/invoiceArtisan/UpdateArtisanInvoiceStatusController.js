const db = require("../../../data/index.js");
const { Invoice, Company, Artisan } = db;

const updateArtisanInvoiceStatus = async (req, res, next) => {
  console.log("Updating artisan invoice status:", req.params.id);
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

    await invoice.update({ paid: req.body.paid });

    console.log("Artisan invoice status updated successfully");

    // Взимаме обновената фактура с релациите
    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["id", "name", "address", "email"]
        },
        {
          model: Artisan,
          as: "artisan",
          attributes: ["id", "name", "note", "email", "number"]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Artisan invoice status updated successfully",
      data: {
        id: updatedInvoice.id,
        invoice_number: updatedInvoice.invoice_number,
        artisan: updatedInvoice.artisan
          ? {
              id: updatedInvoice.artisan.id,
              name: updatedInvoice.artisan.name,
              email: updatedInvoice.artisan.email,
              number: updatedInvoice.artisan.number,
              note: updatedInvoice.artisan.note
            }
          : null,
        company: updatedInvoice.company
          ? {
              id: updatedInvoice.company.id,
              name: updatedInvoice.company.name,
              address: updatedInvoice.company.address,
              email: updatedInvoice.company.email
            }
          : null,
        total_amount: updatedInvoice.total_amount,
        status: updatedInvoice.status,
        paid: updatedInvoice.paid,
        due_date: updatedInvoice.due_date,
        created_at: updatedInvoice.created_at
      }
    });
  } catch (error) {
    console.error("Error updating artisan invoice status:", error);
    next(error);
  }
};

module.exports = { updateArtisanInvoiceStatus };
