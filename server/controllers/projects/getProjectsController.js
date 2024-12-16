//server\controllers\projects\getProjectsController.js
const db = require("../../data/index.js");
const { Project, Company } = db;

const getProjects = async (req, res, next) => {
  console.log("Fetching all projects...");
  try {
    const projects = await Project.findAll({
      attributes: ["id", "name", "companyId", "company_name", "email", "address", "start_date", "end_date", "note", "status"],
      order: [["id", "DESC"]]
    });

    console.log("Projects fetched successfully");

    // Форматираме данните според изисквания формат
    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      companyId: project.companyId,
      company_name: project.company_name,
      email: project.email,
      address: project.address,
      start_date: project.start_date,
      end_date: project.end_date,
      note: project.note,
      status: project.status
    }));

    // Връщаме директно масива с проекти
    res.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error);
  }
};

module.exports = {
  getProjects
};
