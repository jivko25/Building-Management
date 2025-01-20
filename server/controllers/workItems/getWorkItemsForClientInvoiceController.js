const db = require("../../data/index.js");
const { WorkItem, Project, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");
const { Op } = require("sequelize");

const getWorkItemsForClientInvoice = async (req, res, next) => {
  const { company_id, client_id } = req.query;

  try {
    console.log("🔍 Fetching work items for company:", company_id, "and client:", client_id);

    if (!company_id || !client_id) {
      throw new ApiError(400, "Company ID and Client ID are required!");
    }

    // Първо намираме всички проекти за тази компания и клиент
    const projects = await Project.findAll({
      where: {
        company_id: company_id,
        client_id: client_id
      },
      attributes: ["id", "name", "location"]
    });

    if (!projects.length) {
      return res.json({
        status: "success",
        data: []
      });
    }

    const projectIds = projects.map(project => project.id);

    // След това намираме всички работни елементи за тези проекти
    const workItems = await WorkItem.findAll({
      where: {
        project_id: { [Op.in]: projectIds },
        is_client_invoiced: false,
        status: "done"
      },
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["id", "name", "location"]
        },
        {
          model: Activity,
          as: "activity",
          attributes: ["id", "name", "price_per_measure"]
        },
        {
          model: Measure,
          as: "measure",
          attributes: ["id", "name"]
        }
      ],
      order: [
        ["project_id", "ASC"],
        ["id", "ASC"]
      ]
    });

    // Групираме работните елементи по проекти
    const groupedWorkItems = projects.map(project => ({
      projectId: project.id,
      projectName: project.name,
      projectLocation: project.location,
      workItems: workItems.filter(item => item.project_id === project.id)
    }));

    console.log(`📦 Found ${workItems.length} work items across ${projects.length} projects`);

    res.json({
      status: "success",
      data: groupedWorkItems
    });
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal Server Error!"));
    }
  }
};

module.exports = {
  getWorkItemsForClientInvoice
};
