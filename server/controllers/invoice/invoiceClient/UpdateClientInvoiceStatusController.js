const db = require("../../../data/index.js");
const { Invoice, Company, Client } = db;

const updateClientInvoiceStatus = async (req, res, next) => {
  console.log("Updating invoice status:", req.params.id);
  try {
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: false
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Client invoice not found"
      });
    }

    await invoice.update({ paid: req.body.paid });

    console.log("Invoice status updated successfully");

    // Взимаме обновената фактура с релациите
    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: Company,
          as: "company",
          attributes: ["name", "address", "registration_number", "vat_number", "iban", "logo_url", "phone"]
        },
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name", "client_name", "client_company_address", "client_company_iban", "client_emails"]
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Invoice status updated successfully",
      data: updatedInvoice
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    next(error);
  }
};

module.exports = { updateClientInvoiceStatus };
