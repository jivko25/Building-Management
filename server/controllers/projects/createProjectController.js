//server\controllers\projects\createProjectController.js
const db = require("../../data/index.js");
const { Project, Company, Client } = db;
const ApiError = require("../../utils/apiError");

const createProject = async (req, res, next) => {
  const { name, company_name, email, address, location, start_date, end_date, note, status, client_id } = req.body;

  try {
    console.log("Creating new project with data:", req.body);

    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
      throw new ApiError(400, `${name} already exists!`);
    }

    const company = await Company.findOne({ where: { name: company_name } });
    if (!company) {
      throw new ApiError(404, "Company not found!");
    }

    if (client_id) {
      const client = await Client.findByPk(client_id);
      if (!client) {
        throw new ApiError(404, "Client not found!");
      }
    }

    const newProject = await Project.create({
      name,
      company_id: company.id,
      company_name,
      email,
      address,
      location,
      start_date,
      end_date,
      note,
      status,
      creator_id: req.user.id,
      client_id
    });

    console.log("Project created successfully:", newProject.id);

    res.status(201).json({
      message: "Project created successfully!",
      project: newProject
    });
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  createProject
};
