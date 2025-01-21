//server\controllers\tasks\getTasksController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure, Project } = db;
const ApiError = require("../../utils/apiError");

const getTasks = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    if (isAdmin) {
      const tasks = await Task.findAll({
        where: { project_id: req.params.id },
        include: [
          {
            model: Artisan,
            as: "artisans",
            through: { attributes: [] }
          },
          { model: Activity, as: "activity", attributes: ["name"] },
          { model: Measure, as: "measure", attributes: ["name"] }
        ],
        order: [["id", "DESC"]]
      });
      return res.json(tasks);
    }
    const projects = await Project.findAll({
      where: {
        creator_id: req.user.id,
        id: req.params.id
      }
    });
    if (projects.length === 0) {
      throw new ApiError(404, "No projects found for current user");
    }
    const tasks = await Task.findAll({
        where: { project_id: req.params.id },
        include: [
            {
                model: Artisan,
                as: "artisans",
                through: { attributes: [] }
            },
            { model: Activity, as: "activity", attributes: ["name"] },
            { model: Measure, as: "measure", attributes: ["name"] }
        ],
        order: [["id", "DESC"]]
    });

    res.json(tasks);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
    getTasks
};

