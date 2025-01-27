const db = require("../../data/index.js");
const { Project, Artisan, TasksArtisan, Client } = db;
const { Op } = require("sequelize");
const ApiError = require("../../utils/apiError.js");

const getProjects = async (req, res, next) => {
  try {
    // Дефинираме whereClause в началото на функцията
    let whereClause = {};
    const isAdmin = req.user.role === "admin";

    if (req.query.search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{ name: { [Op.like]: `%${req.query.search}%` } }, { company_name: { [Op.like]: `%${req.query.search}%` } }]
      };
    }
    if (isAdmin) {
      const projects = await Project.findAll({
        where: whereClause,
        include: [
          {
            model: Client,
            as: "client",
            attributes: ["client_company_name"]
          }
        ],
        attributes: ["id", "name", "company_id", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id", "client_id"]
      });

      const formattedProjects = projects.map(project => ({
        ...project.toJSON(),
        client_company_name: project.client?.client_company_name
      }));

      return res.json(formattedProjects);
    }

    // Добавяме проверка за търсене

    whereClause.creator_id = req.user.id;

    const projects = await Project.findAll({
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name"]
        }
      ],
      attributes: ["id", "name", "company_id", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id", "client_id"],
      where: whereClause,
      order: [["id", "DESC"]]
    });

    const formattedProjects = projects.map(project => ({
      ...project.toJSON(),
      client_company_name: project.client?.client_company_name
    }));

    res.json(formattedProjects);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }

  // Ако потребителят е "user"
  if (req.user.role === "user") {
    try {
      const artisan = await Artisan.findOne({
        where: { user_id: req.user.id }
      });
      if (artisan) {
        const tasks = await TasksArtisan.findAll({
          where: { artisan_id: artisan.id }
        });
        if (tasks.length === 0) {
          return res.json([]);
        }
        const taskIds = tasks.map(task => task.task_id);
        const projects = await Project.findAll({
          where: { id: { [Op.in]: taskIds } }
        });
        if (projects.length === 0) {
          return res.json([]);
        }
        return res.json(projects);
      }
    } catch (error) {
      next(new ApiError(500, "Error fetching user projects."));
    }
  }
};

const getPaginatedProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "" } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [{ name: { [Op.like]: `%${q}%` } }, { address: { [Op.like]: `%${q}%` } }, { location: { [Op.like]: `%${q}%` } }, { company_name: { [Op.like]: `%${q}%` } }, { "$client.client_company_name$": { [Op.like]: `%${q}%` } }]
    };

    console.log("Executing paginated projects query with params:", { page, limit, q, offset });

    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["client_company_name"],
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    });

    console.log("Query results:", { count, projectsCount: projects.length });

    res.json({
      data: projects,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error("Error in getPaginatedProjects:", error);
    next(new ApiError(500, "Грешка при взимане на проекти"));
  }
};

module.exports = {
  getProjects,
  getPaginatedProjects
};
