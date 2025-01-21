const db = require("../../../data/index.js");
const { Invoice, InvoiceItem, Company, Activity, Measure, Project, Task, Client, WorkItem, DefaultPricing } = db;
const { createInvoicePDF } = require("../../../utils/pdfGenerator.js");
const { sendInvoiceEmail } = require("../../../utils/invoiceEmailService.js");
const { sequelize } = require("../../../data/index.js");
const ApiError = require("../../../utils/apiError.js");

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
    const { company_id, client_company_id, due_date_weeks, project_ids, work_item_ids } = req.body;

    // Валидация на входните данни
    if (!company_id || !client_company_id || !due_date_weeks || !project_ids || !work_item_ids) {
      throw new ApiError(400, "Missing required fields!");
    }

    if (!Array.isArray(project_ids) || project_ids.length === 0) {
      throw new ApiError(400, "project_ids must be a non-empty array");
    }

    if (!Array.isArray(work_item_ids) || work_item_ids.length === 0) {
      throw new ApiError(400, "work_item_ids must be a non-empty array");
    }

    // Проверка дали компанията съществува
    const company = await Company.findByPk(company_id);
    if (!company) {
      throw new ApiError(404, `Company with ID ${company_id} not found`);
    }

    // Проверка дали клиентът съществува
    const client = await Client.findByPk(client_company_id);
    if (!client) {
      throw new ApiError(404, `Client with ID ${client_company_id} not found`);
    }
    console.log("Found client:", { id: client.id, email: client.client_emails });

    // Проверка дали проектите съществуват
    const projects = await Project.findAll({
      where: { id: project_ids }
    });
    if (projects.length !== project_ids.length) {
      throw new ApiError(404, "One or more selected projects do not exist");
    }

    // Намираме работните елементи с всички необходими релации
    const workItems = await WorkItem.findAll({
      where: {
        id: work_item_ids,
        is_client_invoiced: false
      },
      include: [
        {
          model: Task,
          as: "task",
          required: true,
          include: [
            {
              model: Project,
              as: "project",
              required: true,
              where: {
                id: project_ids
              }
            }
          ]
        },
        {
          model: Activity,
          as: "activity",
          required: true
        },
        {
          model: Measure,
          as: "measure",
          required: true
        }
      ]
    });

    if (!workItems.length) {
      throw new ApiError(404, "No valid work items found. Items might be already invoiced or not associated with selected projects");
    }

    // Проверка за липсващи данни в работните елементи
    workItems.forEach((workItem, index) => {
      if (!workItem.task) {
        throw new ApiError(400, `Work item ${workItem.id} has no associated task`);
      }
      if (!workItem.task.project) {
        throw new ApiError(400, `Task for work item ${workItem.id} has no associated project`);
      }
      if (!workItem.activity) {
        throw new ApiError(400, `Work item ${workItem.id} has no associated activity`);
      }
      if (!workItem.measure) {
        throw new ApiError(400, `Work item ${workItem.id} has no associated measure`);
      }
    });

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
      // Намираме цената от DefaultPricing
      const defaultPricing = await DefaultPricing.findOne({
        where: {
          project_id: workItem.task.project.id,
          activity_id: workItem.activity.id,
          measure_id: workItem.measure.id
        },
        attributes: ["id", "activity_id", "measure_id", "project_id", "manager_price", "artisan_price"]
      });

      if (!defaultPricing) {
        throw new ApiError(404, `No default pricing found for activity ${workItem.activity.name} in project ${workItem.task.project.name}`);
      }

      const invoiceItem = await InvoiceItem.create(
        {
          invoice_id: invoice.id,
          work_item_id: workItem.id,
          activity_id: workItem.activity.id,
          measure_id: workItem.measure.id,
          project_id: workItem.task.project.id,
          task_id: workItem.task.id,
          quantity: parseFloat(workItem.quantity),
          price_per_unit: parseFloat(defaultPricing.manager_price),
          total_price: parseFloat(workItem.quantity) * parseFloat(defaultPricing.manager_price)
        },
        { transaction: t }
      );

      totalAmount += invoiceItem.total_price;

      // Маркираме работния елемент като фактуриран
      await workItem.update({ is_client_invoiced: true }, { transaction: t });
    }

    // Обновяваме общата сума на фактурата
    await invoice.update({ total_amount: totalAmount }, { transaction: t });

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
        invoice_number: invoiceNumber,
        total_amount: totalAmount
      }
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating invoice:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        status: error.status,
        message: error.message
      });
    } else {
      next(new ApiError(500, "Internal Server Error"));
    }
  }
};

module.exports = { createClientInvoice };
