//server/controllers/tasks/createTaskController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const createTask = async (req, res, next) => {
  const projectId = req.params.id;
  const {
    name,
    artisans, // Променено от artisan на artisans (масив от имена)
    activity,
    measure,
    total_price,
    total_work_in_selected_measure,
    start_date,
    end_date,
    note,
    status
  } = req.body;

  try {
    console.log("Creating new task:", { name, artisans });

    const existingTask = await Task.findOne({ where: { name } });
    if (existingTask) {
      throw new ApiError(400, `${name} already exists!`);
    }

    // Проверка дали artisans е масив
    if (!Array.isArray(artisans)) {
      throw new ApiError(400, "Artisans must be an array!");
    }

    // Намиране на всички артисани
    const artisanRecords = await Artisan.findAll({
      where: { name: artisans }
    });

    console.log("Found artisans:", artisanRecords.length);

    if (artisanRecords.length !== artisans.length) {
      throw new ApiError(404, "Some artisans were not found!");
    }

    const [activityRecord, measureRecord] = await Promise.all([Activity.findOne({ where: { name: activity } }), Measure.findOne({ where: { name: measure } })]);

    if (!activityRecord) throw new ApiError(404, "Activity not found!");
    if (!measureRecord) throw new ApiError(404, "Measure not found!");

    // Създаване на задачата
    const newTask = await Task.create({
      project_id: projectId,
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

    console.log("Task created:", newTask.id);

    // Добавяне на артисаните към задачата
    await newTask.setArtisans(artisanRecords);

    // Взимане на задачата с всички връзки
    const taskWithRelations = await Task.findByPk(newTask.id, {
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

    console.log("Task created successfully with artisans");

    res.status(201).json({
      message: "Task created successfully!",
      task: taskWithRelations
    });
  } catch (error) {
    console.error("Error in createTask:", error);
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
