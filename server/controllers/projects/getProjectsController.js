//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Company } = db;
const { Op } = require("sequelize");

const getProjects = async (req, res, next) => {
  try {
    let whereClause = {};
    const isAdmin = req.user.role === "admin";
    if (isAdmin) {
      const projects = await Project.findAll();
      return res.json(projects);
    }
    if (projects.length === 0) {
      throw new ApiError(404, "No projects found for current user");
    }

    if (req.query.search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{ name: { [Op.like]: `%${req.query.search}%` } }, { company_name: { [Op.like]: `%${req.query.search}%` } }]
      };
    }

    whereClause.creator_id = req.user.id;

    const projects = await Project.findAll({
      attributes: ["id", "name", "company_id", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id"],
      where: whereClause,
      order: [["id", "DESC"]]
    });

    if (projects.length === 0) {
      throw new ApiError(404, "No projects found for current user");
    }
    res.json(projects);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getProjects
};
