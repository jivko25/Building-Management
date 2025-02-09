const db = require("../../data/index.js");
const { WorkItem, Project, Activity, Measure, Artisan, Task } = db;
const ApiError = require("../../utils/apiError");
const { Op } = require("sequelize");

const getWorkItemsForArtisanInvoice = async (req, res, next) => {
  const { company_id, artisan_id } = req.query;

  try {
    console.log("🔍 Starting to fetch work items for artisan with filters:", { company_id, artisan_id });

    // Базови условия за WorkItem
    const workItemWhere = {
      is_artisan_invoiced: false,
      status: "done"
    };

    if (artisan_id) workItemWhere.artisan_id = parseInt(artisan_id);

    // Условия за Project
    const projectWhere = {};
    if (company_id) projectWhere.company_id = parseInt(company_id);

    if (!company_id) projectWhere.creator_id = req.user.id;

    console.log("📋 Constructed where clauses:", { workItemWhere, projectWhere });

    // Намираме всички работни елементи според филтрите
    const workItems = await WorkItem.findAll({
      where: workItemWhere,
      include: [
        {
          model: Project,
          as: "project",
          where: projectWhere, // Прилагаме company_id филтъра тук
          attributes: ["id", "name", "location", "company_id"],
          required: true
        },
        {
          model: Activity,
          as: "activity",
          attributes: ["id", "name"]
        },
        {
          model: Measure,
          as: "measure",
          attributes: ["id", "name"]
        },
        {
          model: Artisan,
          as: "artisan",
          attributes: ["id", "name", "email"]
        },
        {
          model: Task,
          as: "task",
          attributes: ["id", "name"]
        }
      ],
      order: [
        ["artisan_id", "ASC"],
        ["project_id", "ASC"],
        ["id", "ASC"]
      ]

    });

    console.log(`📦 Found ${workItems.length} work items`);

    // Групираме работните елементи по майстори и проекти
    const groupedByArtisan = {};

    workItems.forEach(workItem => {
      const artisanId = workItem.artisan_id;
      const projectId = workItem.project_id;

      if (!groupedByArtisan[artisanId]) {
        groupedByArtisan[artisanId] = {
          artisanId: artisanId,
          artisanName: workItem.artisan?.name,
          artisanEmail: workItem.artisan?.email,
          projects: {}
        };
      }

      if (!groupedByArtisan[artisanId].projects[projectId]) {
        groupedByArtisan[artisanId].projects[projectId] = {
          projectId: projectId,
          projectName: workItem.project?.name,
          projectLocation: workItem.project?.location,
          workItems: []
        };
      }

      groupedByArtisan[artisanId].projects[projectId].workItems.push(workItem);
    });

    // Преобразуваме обекта в масив и форматираме данните
    const formattedData = Object.values(groupedByArtisan).map(artisan => ({
      ...artisan,
      projects: Object.values(artisan.projects)
    }));

    console.log(`🎯 Final result: ${formattedData.length} artisans with work items`);

    return res.json({
      status: "success",
      data: formattedData
    });
  } catch (error) {
    console.error("❌ Detailed error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });

    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, `Internal Server Error: ${error.message}`));
    }
  }
};

module.exports = {
  getWorkItemsForArtisanInvoice
};
