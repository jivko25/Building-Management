//server\controllers\tasks\editTaskController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const editTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { name, artisans, activity, measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found!");
    }

    if (task.name !== name) {
      const existingTask = await Task.findOne({ where: { name } });
      if (existingTask) {
        throw new ApiError(400, `${name} already exists!`);
      }
    }

    const [activityRecord, measureRecord] = await Promise.all([Activity.findOne({ where: { name: activity } }), Measure.findOne({ where: { name: measure } })]);

    if (!activityRecord) throw new ApiError(404, "Activity not found!");
    if (!measureRecord) throw new ApiError(404, "Measure not found!");

    // Обновяване на основната информация за задачата
    const updatedTask = await task.update({
      name,
      activity_id: activityRecord.id,
      measure_id: measureRecord.id,
      total_price,
      total_work_in_selected_measure,
      start_date,
      end_date,
      note,
      status
    });

    // Обновяване на връзките с артисани
    if (artisans && Array.isArray(artisans)) {
      const artisanRecords = await Artisan.findAll({
        where: { name: artisans }
      });

      if (artisanRecords.length !== artisans.length) {
        throw new ApiError(404, "Some artisans were not found!");
      }

      await task.setArtisans(artisanRecords);
    }

    // Взимане на обновената задача с артисаните
    const taskWithArtisans = await Task.findByPk(taskId, {
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

    res.json({
      message: "Task updated successfully!",
      task: taskWithArtisans
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
  editTask
};
