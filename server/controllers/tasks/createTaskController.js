//server\controllers\tasks\createTaskController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const createTask = async (req, res, next) => {
  const projectId = req.params.id;
  const { name, artisan, activity, measure, price_per_measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;

  try {
    const existingTask = await Task.findOne({ where: { name } });
    if (existingTask) {
      throw new ApiError(400, `${name} already exists!`);
    }

    const [artisanRecord, activityRecord, measureRecord] = await Promise.all([Artisan.findOne({ where: { name: artisan } }), Activity.findOne({ where: { name: activity } }), Measure.findOne({ where: { name: measure } })]);

    if (!artisanRecord) throw new ApiError(404, "Artisan not found!");
    if (!activityRecord) throw new ApiError(404, "Activity not found!");
    if (!measureRecord) throw new ApiError(404, "Measure not found!");

    const newTask = await Task.create({
      project_id: projectId,
      name,
      artisan_id: artisanRecord.id,
      activity_id: activityRecord.id,
      measure_id: measureRecord.id,
      price_per_measure,
      total_price,
      total_work_in_selected_measure,
      start_date,
      end_date,
      note,
      status
    });

    res.status(201).json({
      message: "Task created successfully!",
      task: newTask
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
  createTask
};
