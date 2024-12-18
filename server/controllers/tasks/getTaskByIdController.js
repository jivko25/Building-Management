//server\controllers\tasks\getTaskByIdController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.taskId, {
      include: [
        {
          model: Artisan,
          as: "artisans",
          through: { attributes: [] }
        },
        { model: Activity, as: "activity", attributes: ["name"] },
        { model: Measure, as: "measure", attributes: ["name"] }
      ]
    });

    if (!task) {
      throw new ApiError(404, "Task not found!");
    }
    res.json(task);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getTaskById
};
