//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Company } = db;

const getProjects = async (req, res, next) => {
  console.log("Fetching all projects...");
  console.log("User role:", req.user.role);
  console.log("User ID:", req.user.id);

  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.findAll({
        attributes: ["id", "name", "companyId", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id"],
        order: [["id", "DESC"]]
      });
    } else {
      projects = await Project.findAll({
        attributes: ["id", "name", "companyId", "company_name", "email", "address", "location", "start_date", "end_date", "note", "status", "creator_id"],
        where: {
          creator_id: req.user.id
        },
        order: [["id", "DESC"]]
      });
    }

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
