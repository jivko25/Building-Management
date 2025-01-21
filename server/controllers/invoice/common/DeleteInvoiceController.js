const db = require("../../../data/index.js");
const { Invoice, InvoiceItem, WorkItem } = db;
const { sequelize } = require("../../../data/index.js");

const deleteInvoice = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log("Starting invoice deletion process...");
    const { id } = req.params;

    // Намираме фактурата без значение дали е за клиент или занаятчия
    const invoice = await Invoice.findOne({
      where: {
        id: id
      },
      transaction: t
    });

    if (!invoice) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    console.log("Found invoice:", invoice.id, "Type:", invoice.is_artisan_invoice ? "Artisan" : "Client");

    // Намираме всички работни елементи свързани с фактурата
    const invoiceItems = await InvoiceItem.findAll({
      where: {
        invoice_id: id
      },
      transaction: t
    });

    console.log("Found invoice items:", invoiceItems.length);

    // Обновяваме работните елементи като нефактурирани според типа на фактурата
    const workItemIds = invoiceItems.map(item => item.work_item_id);
    await WorkItem.update(
      {
        [invoice.is_artisan_invoice ? "is_artisan_invoiced" : "is_client_invoiced"]: false
      },
      {
        where: {
          id: workItemIds
        },
        transaction: t
      }
    );

    console.log("Updated work items as not invoiced");

    // Изтриваме всички елементи на фактурата
    await InvoiceItem.destroy({
      where: {
        invoice_id: id
      },
      transaction: t
    });

    console.log("Deleted invoice items");

    // Изтриваме самата фактура
    await invoice.destroy({ transaction: t });

    await t.commit();
    console.log("Transaction committed successfully");

    res.status(200).json({
      success: true,
      message: `${invoice.is_artisan_invoice ? "Artisan" : "Client"} invoice deleted successfully`
    });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting invoice:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { deleteInvoice };
