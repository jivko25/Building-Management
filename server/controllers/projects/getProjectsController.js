//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Company } = db;
const { Op } = require("sequelize");

const getProjects = async (req, res, next) => {
  console.log("Fetching all projects...");
  console.log("User role:", req.user.role);
  console.log("User ID:", req.user.id);
  console.log("Search term:", req.query.search);

  try {
    let whereClause = {};

    // Add search functionality
    if (req.query.search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{ name: { [Op.like]: `%${req.query.search}%` } }, { company_name: { [Op.like]: `%${req.query.search}%` } }]
      };
    }

    // Add user role check
    if (req.user.role !== "admin") {
      whereClause.creator_id = req.user.id;
    }

    console.log("Where clause:", JSON.stringify(whereClause, null, 2));

    const projects = await Project.findAll({
      attributes: ["id", "name", "company_id", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id", "client_id"],
      where: whereClause,
      order: [["id", "DESC"]]
    });

    console.log("Number of projects found:", projects.length);
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error);
  }
};

module.exports = {
  getProjects
};
