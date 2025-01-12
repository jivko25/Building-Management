//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Project, Task } = db;

const getMeasures = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";

    if(isAdmin){
      const measures = await Measure.findAll({
        order: [["name", "ASC"]]
      });

      return res.json({
        success: true,
        data: measures
      });
    }

    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if(projects.length === 0){
      throw new ApiError(404, "No projects found for current user");
    }

    const tasks = await Task.findAll({
      where: {
        project_id: {
          [Op.in]: projects.map((project) => project.id)
        }
      }
    });

    if(tasks.length === 0){
      throw new ApiError(404, "No tasks found for current user");
    }

    const measureIds = tasks.map((task) => task.measure_id);

    const measures = await Measure.findAll({
      where: {
        id: {
          [Op.in]: measureIds
        }
      },
      order: [["name", "ASC"]]
    });

    res.json({
      success: true,
      data: measures
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
  getMeasures
};
