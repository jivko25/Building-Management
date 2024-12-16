//server\controllers\projects\getProjectByIdController.js
const db = require("../../data/index.js");
const { Project } = db;
const ApiError = require("../../utils/apiError");

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      throw new ApiError(404, "Project not found!");
    }

    res.json(project);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getProjectById
};
