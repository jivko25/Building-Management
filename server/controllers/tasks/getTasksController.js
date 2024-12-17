//server\controllers\tasks\getTasksController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const getTasks = async (req, res, next) => {
  try {
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
    next(new ApiError(500, "Internal server Error!"));
  }
};

module.exports = {
  getTasks
};
