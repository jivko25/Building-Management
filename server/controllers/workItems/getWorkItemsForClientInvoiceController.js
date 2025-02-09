const db = require("../../data/index.js");
const { WorkItem, Project, Activity, Measure, Task } = db;
const ApiError = require("../../utils/apiError");
const { Op } = require("sequelize");

const getWorkItemsForClientInvoice = async (req, res, next) => {
  const { company_id, client_id, project_id } = req.query;

  try {
    console.log("🔍 Starting to fetch work items with filters:", { company_id, client_id, project_id });

    // Конвертираме стринговите параметри в числа, ако съществуват
    const whereClause = {};

    if (!company_id && !client_id && !project_id) {
      whereClause.creator_id = req.user.id;
    }

    
    
    if (company_id) whereClause.company_id = parseInt(company_id);
    if (client_id) whereClause.client_id = parseInt(client_id);
    if (project_id) whereClause.id = parseInt(project_id); // За проекта използваме id
    
    console.log(whereClause, 'whereClause');

    console.log("📋 Constructed where clause:", whereClause);

    // Намираме всички проекти според филтрите
    const projects = await Project.findAll({
      where: whereClause,
      attributes: ["id", "name", "location", "company_id", "client_id"],
      raw: true
    });

    console.log(`📊 Found ${projects.length} projects:`, projects);

    if (!projects.length) {
      console.log("ℹ️ No projects found with current filters");
      return res.json({
        status: "success",
        data: []
      });
    }

    const projectIds = projects.map(project => project.id);

    console.log(projectIds, 'projectIds');

    // Намираме всички работни елементи за тези проекти

    const workItemsResponse = await WorkItem.findAll({
      where: {
        is_client_invoiced: false,
        status: "done"
      },
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["id", "name", "location", "company_id", "client_id"]
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
          model: Task,
          as: "task",
          attributes: ["id", "name"]
        }
      ],
      order: [

        ["project_id", "ASC"],
        ["id", "ASC"]
      ]
    });

    const workItems = workItemsResponse.filter(item => projectIds.includes(item.project_id));

    console.log(workItems, 'workItems');
    

    console.log(`📦 Found ${workItems.length} work items`);

    // Групираме работните елементи по проекти
    const groupedWorkItems = projects.map(project => ({
      projectId: project.id,
      projectName: project.name,
      projectLocation: project.location,
      companyId: project.company_id,
      clientId: project.client_id,
      workItems: workItems.filter(item => item.project_id === project.id)
    }));

    // Филтрираме проекти без работни елементи
    const filteredGroupedWorkItems = groupedWorkItems.filter(group => group.workItems.length > 0);

    console.log(`🎯 Final result: ${filteredGroupedWorkItems.length} projects with work items`);

    return res.json({
      status: "success",
      data: filteredGroupedWorkItems
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
  getWorkItemsForClientInvoice
};
