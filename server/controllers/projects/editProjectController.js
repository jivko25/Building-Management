//server\controllers\projects\editProjectController.js
const db = require("../../data/index.js");
const { Project, Company } = db;
const ApiError = require("../../utils/apiError");

const editProject = async (req, res, next) => {
  console.log("Editing project with data:", req.body);
  const projectId = req.params.id;
  const { name, company_name, email, address, start_date, end_date, note, status, location } = req.body;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found!");
    }

    if (project.name !== name) {
      const existingProject = await Project.findOne({ where: { name } });
      if (existingProject) {
        throw new ApiError(400, `${name} already exists!`);
      }
    }

    const company = await Company.findOne({ where: { name: company_name } });
    if (!company) {
      throw new ApiError(404, "Company not found!");
    }

    const updatedProject = await project.update({
      name,
      company_id: company.id,
      company_name,
      email,
      address,
      start_date,
      end_date,
      note,
      status,
      location
    });

    // Форматиране на отговора според изисквания формат
    const formattedProject = {
      id: updatedProject.id.toString(),
      name: updatedProject.name,
      company_id: updatedProject.company_id,
      company_name: updatedProject.company_name,
      email: updatedProject.email,
      address: updatedProject.address,
      start_date: updatedProject.start_date,
      end_date: updatedProject.end_date,
      note: updatedProject.note,
      status: updatedProject.status,
      location: updatedProject.location
    };

    res.json({
      message: "Project updated successfully!",
      project: formattedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  editProject
};
