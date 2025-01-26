const db = require("../../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Artisan, WorkItem, DefaultPricing } = db;
const { createArtisanInvoicePDF } = require("../../../utils/pdfGenerator.js");
const { sendInvoiceEmail } = require("../../../utils/invoiceEmailService.js");
const { sequelize } = require("../../../data/index.js");

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
      week_number: week,
      is_artisan_invoice: true
    },
    order: [["created_at", "DESC"]]
  });

  const lastNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split("-").pop()) : 0;
  const newNumber = lastNumber + 1;
  const invoiceNumber = `A${year}-${week.toString().padStart(2, "0")}/${week.toString().padStart(2, "0")}-${newNumber}`;

  console.log("Generated invoice number:", invoiceNumber);
  return invoiceNumber;
};

const createArtisanInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    console.log("Creating artisan invoice with data:", req.body);
    const { company_id, artisan_id, due_date_weeks, project_ids, work_item_ids } = req.body;

    // Validate input
    if (!company_id || !artisan_id || !due_date_weeks || !project_ids || !work_item_ids) {
      throw new Error("Missing required fields");
    }

    // Find work items
    const workItems = await WorkItem.findAll({
      where: {
        id: work_item_ids,
        artisan_id: artisan_id,
        is_artisan_invoiced: false
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
                id: project_ids
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
      throw new Error("No valid work items found");
    }

    // Generate invoice number
    const currentDate = new Date();
    const { week, year } = getWeekNumber(currentDate);
    const invoiceNumber = await generateUniqueInvoiceNumber(year, week);

    // Форматираме датите правилно
    const invoice_date = new Date().toISOString();
    const due_date = new Date(currentDate.setDate(currentDate.getDate() + due_date_weeks * 7)).toISOString();

    // Create invoice с форматирани дати
    const invoice = await Invoice.create(
      {
        invoice_number: invoiceNumber,
        year,
        week_number: week,
        company_id,
        client_company_id: null,
        invoice_date: invoice_date,
        due_date: due_date,
        total_amount: 0,
        paid: false,
        is_artisan_invoice: true,
        artisan_id
      },
      { transaction: t }
    );

    let totalAmount = 0;

    // Create invoice items
    for (const workItem of workItems) {
      const defaultPricing = await DefaultPricing.findOne({
        attributes: ["id", "activity_id", "measure_id", "project_id", "manager_price", "artisan_price"],
        where: {
          project_id: workItem.task.project.id,
          activity_id: workItem.activity.id,
          measure_id: workItem.measure.id
        }
      });

      if (!defaultPricing) {
        throw new Error(`Default pricing not found for project ${workItem.task.project.id}, activity ${workItem.activity.id}, measure ${workItem.measure.id}`);
      }

      const invoiceItem = await InvoiceItem.create(
        {
          invoice_id: invoice.id,
          work_item_id: workItem.id,
          project_id: workItem.task.project.id,
          task_id: workItem.task.id,
          activity_id: workItem.activity.id,
          measure_id: workItem.measure.id,
          quantity: workItem.quantity,
          price_per_unit: defaultPricing.artisan_price,
          total_price: workItem.quantity * defaultPricing.artisan_price
        },
        { transaction: t }
      );

      totalAmount += invoiceItem.total_price;

      // Mark work item as invoiced
      await workItem.update({ is_artisan_invoiced: true }, { transaction: t });
    }

    // Update invoice total
    await invoice.update({ total_amount: totalAmount }, { transaction: t });

    await t.commit();

    // Добавяме генериране на PDF и изпращане на имейл
    try {
      // Намираме занаятчията, за да вземем имейла му
      const artisan = await Artisan.findByPk(artisan_id);

      if (!artisan || !artisan.email) {
        console.error("Artisan email not found");
        throw new Error("Artisan email not found");
      }

      // Генерираме PDF
      const pdfBuffer = await createArtisanInvoicePDF(invoice.id);

      // Изпращаме имейла
      await sendInvoiceEmail(
        artisan.email,
        pdfBuffer,
        invoice.invoice_number,
        1 // Използваме английски език по подразбиране за занаятчии
      );

      console.log("PDF generated and email sent successfully");
    } catch (error) {
      console.error("Error with PDF/email:", error);
      // Не прекъсваме изпълнението, ако имейлът не се изпрати
    }

    res.status(201).json({
      success: true,
      message: "Artisan invoice created successfully",
      data: {
        invoice_id: invoice.id,
        invoice_number: invoiceNumber,
        total_amount: totalAmount,
        due_date: due_date,
        invoice_date: invoice_date,
        artisan_id: artisan_id,
        company_id: company_id,
        client_company_id: null,
        paid: false,
        is_artisan_invoice: true,
        week_number: week,
        year: year,
        invoice_language_id: 1,
      }
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating artisan invoice:", error);
    res.status(400).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { createArtisanInvoice };
