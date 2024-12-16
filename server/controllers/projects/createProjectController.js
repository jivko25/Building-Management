//server\controllers\projects\createProjectController.js
const db = require("../../data/index.js");
const { Project, Company } = db;
const ApiError = require("../../utils/apiError");

const createProject = async (req, res, next) => {
  const { name, company_name, email, address, start_date, end_date, note, status } = req.body;

  try {
    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
      throw new ApiError(400, `${name} already exists!`);
    }

    const company = await Company.findOne({ where: { name: company_name } });
    if (!company) {
      throw new ApiError(404, "Company not found!");
    }

    const newProject = await Project.create({
      name,
      companyId: company.id,
      company_name,
      email,
      address,
      start_date,
      end_date,
      note,
      status
    });

    res.status(201).json({
      message: "Project created successfully!",
      project: newProject
    });
  } catch (error) {
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
