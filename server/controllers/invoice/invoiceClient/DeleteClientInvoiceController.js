const db = require("../../../data/index.js");
const { Invoice, InvoiceItem, WorkItem } = db;
const { sequelize } = require("../../../data/index.js");

const deleteClientInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    console.log("Deleting client invoice with ID:", req.params.id);

    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: false
      },
      include: [
        {
          model: InvoiceItem,
          as: "items"
        }
      ]
    });

    if (!invoice) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Client invoice not found"
      });
    }

    // Get all work items related to this invoice
    const workItemIds = invoice.items.map(item => item.work_item_id);

    // Reset invoice flags for work items
    await WorkItem.update(
      { is_client_invoiced: false },
      {
        where: { id: workItemIds },
        transaction: t
      }
    );

    // Delete invoice items
    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id },
      transaction: t
    });

    // Delete invoice
    await invoice.destroy({ transaction: t });
    await t.commit();

    console.log("Client invoice deleted successfully");

    res.status(200).json({
      success: true,
      message: "Client invoice deleted successfully"
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting client invoice:", error);
    next(error);
  }
};

module.exports = { deleteClientInvoice };
