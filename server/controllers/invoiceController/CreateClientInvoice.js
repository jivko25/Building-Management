const db = require("../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client, WorkItem } = db;
const { createInvoicePDF } = require("../../utils/pdfGenerator");
const { sendInvoiceEmail } = require("../../utils/invoiceEmailService");
const { sequelize } = require("../../data/index.js");

const getWeekNumber = date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

  return {
    week: weekNumber,
    year: d.getFullYear()
  };
};

const generateUniqueInvoiceNumber = async (year, week) => {
  console.log("Generating unique invoice number for year:", year, "week:", week);

  const lastInvoice = await Invoice.findOne({
    where: {
      year,
      week_number: week
    },
    order: [["invoice_number", "DESC"]]
  });

  let sequence = 1;
  if (lastInvoice) {
    const parts = lastInvoice.invoice_number.split("-");
    sequence = parseInt(parts[parts.length - 1]) + 1;
  }

  return `${year}-${week.toString().padStart(2, "0")}/${week}-${sequence}`;
};

const createClientInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    console.log("Creating invoice with data:", req.body);
    const { company_id, client_company_id, due_date_weeks, selected_projects, selected_work_items } = req.body;

    // Намираме клиента
    const client = await Client.findByPk(client_company_id);
    if (!client) {
      throw new Error("Client not found");
    }
    console.log("Found client:", { id: client.id, email: client.client_emails });

    // Намираме работните елементи
    const workItems = await WorkItem.findAll({
      where: {
        id: selected_work_items,
        is_client_invoiced: false
      },
      include: [
        {
          model: Task,
          as: "task",
          include: [
            {
              model: Project,
              as: "project",
              where: {
                id: selected_projects
              }
            }
          ]
        },
        {
          model: Activity,
          as: "activity"
        },
        {
          model: Measure,
          as: "measure"
        }
      ]
    });

    if (!workItems.length) {
      throw new Error("No valid work items found. Its either invoiced or not valid");
    }

    // Генерираме номер на фактурата
    const currentDate = new Date();
    const { week, year } = getWeekNumber(currentDate);
    const invoiceNumber = await generateUniqueInvoiceNumber(year, week);

    // Създаваме фактурата
    const invoice = await Invoice.create(
      {
        invoice_number: invoiceNumber,
        year,
        week_number: week,
        company_id,
        client_company_id,
        invoice_date: currentDate,
        due_date: new Date(currentDate.setDate(currentDate.getDate() + due_date_weeks * 7)),
        total_amount: 0,
        is_artisan_invoice: false
      },
      { transaction: t }
    );

    // Създаваме елементите на фактурата
    let totalAmount = 0;
    for (const workItem of workItems) {
      const invoiceItem = await InvoiceItem.create(
        {
          invoice_id: invoice.id,
          work_item_id: workItem.id,
          activity_id: workItem.activity_id,
          measure_id: workItem.measure_id,
          project_id: workItem.task.project.id,
          task_id: workItem.task_id,
          quantity: parseFloat(workItem.quantity),
          price_per_unit: parseFloat(workItem.task.price_per_measure),
          total_price: parseFloat(workItem.quantity) * parseFloat(workItem.task.price_per_measure)
        },
        { transaction: t }
      );
      totalAmount += invoiceItem.total_price;
    }

    // Обновяваме общата сума
    await invoice.update({ total_amount: totalAmount }, { transaction: t });

    // Маркираме работните елементи като фактурирани
    await WorkItem.update(
      { is_client_invoiced: true },
      {
        where: { id: selected_work_items },
        transaction: t
      }
    );

    await t.commit();

    // Генерираме PDF и изпращаме имейл
    try {
      const pdfBuffer = await createInvoicePDF(invoice.id, client.invoice_language_id);
      if (client.client_emails) {
        await sendInvoiceEmail(client.client_emails, pdfBuffer, invoice.invoice_number, client.invoice_language_id);
      }
    } catch (error) {
      console.error("Error with PDF/email:", error);
    }

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: {
        invoice_id: invoice.id,
        invoice_number: invoiceNumber
      }
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating invoice:", error);
    res.status(400).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { createClientInvoice };
