const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Client, Activity, Measure, Project } = db;
const { sequelize } = require("../../data/index.js");

const editClientInvoice = async (req, res, next) => {
  console.log("Updating invoice with ID:", req.params.id);
  const t = await sequelize.transaction();

  try {
    const { client_company_name, client_name, client_company_address, client_company_iban, client_emails, due_date_weeks, items } = req.body;

    // Валидация на входните данни
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Items array is required and cannot be empty");
    }

    // Проверка за задължителни полета в items
    items.forEach((item, index) => {
      const requiredFields = ["activity_id", "measure_id", "project_id", "quantity", "price_per_unit"];
      requiredFields.forEach(field => {
        if (!item[field]) {
          throw new Error(`Field ${field} is required for item at index ${index}`);
        }
      });
    });

    // Намираме фактурата със свързаните данни
    const invoice = await Invoice.findOne({
      where: {
        id: req.params.id,
        is_artisan_invoice: false
      },
      include: [
        {
          model: InvoiceItem,
          as: "items"
        },
        {
          model: Client,
          as: "client"
        }
      ]
    });

    if (!invoice) {
      throw new Error("Client invoice not found");
    }

    console.log("Found invoice:", invoice.invoice_number);

    // Обновяваме датата на падеж
    if (due_date_weeks) {
      if (isNaN(due_date_weeks) || due_date_weeks <= 0) {
        throw new Error("due_date_weeks must be a positive number");
      }
      const due_date = new Date();
      due_date.setDate(due_date.getDate() + due_date_weeks * 7);
      await invoice.update({ due_date }, { transaction: t });
    }

    // Обновяваме клиентската информация
    if (invoice.client_company_id) {
      const clientUpdateData = {};
      if (client_company_name) clientUpdateData.client_company_name = client_company_name;
      if (client_name) clientUpdateData.client_name = client_name;
      if (client_company_address) clientUpdateData.client_company_address = client_company_address;
      if (client_company_iban) clientUpdateData.client_company_iban = client_company_iban;
      if (client_emails) clientUpdateData.client_emails = client_emails;

      if (Object.keys(clientUpdateData).length > 0) {
        await Client.update(clientUpdateData, {
          where: { id: invoice.client_company_id },
          transaction: t
        });
      }
    }

    // Изтриваме старите елементи на фактурата
    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id },
      transaction: t
    });

    // Създаваме новите елементи на фактурата
    const newItems = await Promise.all(
      items.map(async item => {
        return InvoiceItem.create(
          {
            invoice_id: invoice.id,
            project_id: item.project_id,
            activity_id: item.activity_id,
            measure_id: item.measure_id,
            quantity: parseFloat(item.quantity),
            price_per_unit: parseFloat(item.price_per_unit),
            total_price: parseFloat(item.quantity) * parseFloat(item.price_per_unit)
          },
          { transaction: t }
        );
      })
    );

    // Изчисляваме новата обща сума
    const total_amount = newItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    await invoice.update({ total_amount }, { transaction: t });

    await t.commit();

    // Взимаме обновената фактура с всички релации
    const updatedInvoice = await Invoice.findOne({
      where: { id: invoice.id },
      include: [
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
              attributes: ["name"]
            },
            {
              model: Measure,
              as: "measure",
              attributes: ["name"]
            },
            {
              model: Project,
              as: "project",
              attributes: ["name", "address", "location"]
            }
          ]
        }
      ]
    });

    console.log("Invoice updated successfully");

    res.json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice
    });
  } catch (error) {
    await t.rollback();
    console.error("Error updating invoice:", error);
    res.status(400).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { editClientInvoice };
