//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Project, Task, Op } = db;

const getMeasures = async (req, res, next) => {
  try {
    console.log("Getting measures for user:", req.user.id);
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
      const measures = await Measure.findAll({
        order: [["name", "ASC"]]
      });
      console.log("Admin: Returning all measures");
      return res.json({
        success: true,
        data: measures
      });
    }

    // For non-admin users, get measures based on their projects and tasks
    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id
      }
    });

    if (projects.length === 0) {
      console.log("No projects found for user:", req.user.id);
      return res.json({
        success: true,
        data: []
      });
    }

    const tasks = await Task.findAll({
      where: {
        project_id: {
          [Op.in]: projects.map(project => project.id)
        }
      }
    });

    if (tasks.length === 0) {
      console.log("No tasks found for user projects");
      return res.json({
        success: true,
        data: []
      });
    }

    const measureIds = tasks.map(task => task.measure_id);
    const measures = await Measure.findAll({
      where: {
        id: {
          [Op.in]: measureIds
        }
      },
      order: [["name", "ASC"]]
    });

    console.log(`Found ${measures.length} measures for user`);
    return res.json({
      success: true,
      data: measures
    });
  } catch (error) {
    console.error("Error in getMeasures:", error);
    next(error);
  }
};

module.exports = {
  getMeasures
};
