//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Company } = db;

const getProjects = async (req, res, next) => {
  console.log("Fetching all projects...");
  try {
    const whereClause = {};

    if (req.user.role === "manager") {
      whereClause.creator_id = req.user.id;
    }

    const projects = await Project.findAll({
      where: whereClause,
      attributes: ["id", "name", "companyId", "company_name", "email", "address", "start_date", "end_date", "note", "status", "creator_id"],
      order: [["id", "DESC"]]
    });

    console.log("Projects fetched successfully");
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error);
  }
};

module.exports = {
  getProjects
};
