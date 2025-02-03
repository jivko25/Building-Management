//server\controllers\tasks\editTaskController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const editTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { name, artisans, activity, measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;

  try {
    console.log("Editing task with data:", {
      taskId,
      name,
      artisans,
      activity,
      measure
    });

    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found!");
    }

    // Проверка за дублирано име само ако името е променено
    if (name && task.name !== name) {
      const existingTask = await Task.findOne({
        where: {
          name,
          project_id: task.project_id
        }
      });
      if (existingTask) {
        throw new ApiError(400, `Task "${name}" already exists in this project!`);
      }
    }

    // Проверка на артисаните
    if (artisans && artisans.length > 0) {
      const foundArtisans = await Artisan.findAll({
        where: { name: artisans }
      });

      console.log(
        "Found artisans:",
        foundArtisans.map(a => a.name)
      );

      const missingArtisans = artisans.filter(artisanName => !foundArtisans.some(found => found.name === artisanName));

      if (missingArtisans.length > 0) {
        throw new ApiError(404, `Artisans not found: ${missingArtisans.join(", ")}`);
      }

      await task.setArtisans(foundArtisans);
    }

    // Намиране на дейност и мярка
    let activityRecord, measureRecord;
    
    if (activity) {
      activityRecord = await Activity.findOne({ where: { name: activity } });
      if (!activityRecord) {
        throw new ApiError(404, `Activity "${activity}" not found!`);
      }
    }

    if (measure) {
      measureRecord = await Measure.findOne({ where: { name: measure } });
      if (!measureRecord) {
        throw new ApiError(404, `Measure "${measure}" not found!`);
      }
    }

    // Обновяване на основната информация за задачата
    const updateData = {
      ...(name && { name }),
      ...(activityRecord && { activity_id: activityRecord.id }),
      ...(measureRecord && { measure_id: measureRecord.id }),
      ...(total_price && { total_price }),
      ...(total_work_in_selected_measure && { total_work_in_selected_measure }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(note !== undefined && { note }),
      ...(status && { status })
    };

    const updatedTask = await task.update(updateData);

    console.log("Task updated:", updatedTask.id);

    // Взимане на обновената задача с всички връзки
    const taskWithRelations = await Task.findByPk(taskId, {
      include: [
        {
          model: Artisan,
          as: "artisans",
          through: { attributes: [] }
        },
        {
          model: Activity,
          as: "activity",
          attributes: ["name"]
        },
        {
          model: Measure,
          as: "measure",
          attributes: ["name"]
        }
      ]
    });

    console.log("Task updated successfully with all relations");

    res.json({
      success: true,
      message: "Task updated successfully!",
      task: taskWithRelations
    });
  } catch (error) {
    console.error("Error in editTask:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        status: error.status,
        message: error.message
      });
    } else {
      next(new ApiError(500, "Internal Server Error!"));
    }
  }
};

module.exports = {
  editTask
};
