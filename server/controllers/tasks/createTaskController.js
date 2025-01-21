//server/controllers/tasks/createTaskController.js
const db = require("../../data/index.js");
const { Task, Artisan, Activity, Measure } = db;
const { Op } = db.Sequelize;
const ApiError = require("../../utils/apiError");

const createTask = async (req, res, next) => {
  const projectId = req.params.id;
  const { name, artisans, activity, measure, total_price, total_work_in_selected_measure, start_date, end_date, note, status } = req.body;

  try {
    console.log("Creating new task with data:", {
      projectId,
      name,
      artisans,
      activity,
      measure
    });

    // Валидация на входните данни
    if (!name || !artisans || !activity || !measure) {
      throw new ApiError(400, "Missing required fields!");
    }

    // const existingTask = await Task.findOne({ where: { name } });
    // if (existingTask) {
    //   throw new ApiError(400, `${name} already exists!`);
    // }

    // Проверка за съществуваща задача
    const existingTask = await Task.findOne({ where: { name, project_id: projectId } });
    if (existingTask) {
      throw new ApiError(400, `Task "${name}" already exists in this project!`);
    }

    // Проверка на артисаните
    if (!Array.isArray(artisans)) {
      throw new ApiError(400, "Artisans must be an array!");
    }

    // Намиране на артисаните
    const foundArtisans = await Artisan.findAll({
      where: { name: artisans }
    });

    console.log(
      "Found artisans:",
      foundArtisans.map(a => a.name)
    );
    // // Намиране на всички артисани
    // const artisanRecords = await Artisan.findAll({
    //   where: {
    //     name: {
    //       [Op.in]: artisans,
    //     }
    //   }
    // });

    console.log("Found artisans:", artisanRecords);

    // Проверка дали всички артисани са намерени
    const missingArtisans = artisans.filter(artisanName => !foundArtisans.some(found => found.name === artisanName));

    if (missingArtisans.length > 0) {
      throw new ApiError(404, `Artisans not found: ${missingArtisans.join(", ")}`);
    }

    // Намиране на дейност и мярка
    const [activityRecord, measureRecord] = await Promise.all([Activity.findOne({ where: { name: activity } }), Measure.findOne({ where: { name: measure } })]);

    if (!activityRecord) {
      throw new ApiError(404, `Activity "${activity}" not found!`);
    }
    if (!measureRecord) {
      throw new ApiError(404, `Measure "${measure}" not found!`);
    }

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
    await newTask.setArtisans(foundArtisans);

    // Взимане на задачата с всички връзки
    const taskWithRelations = await Task.findByPk(newTask.id, {
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

    console.log("Task created successfully with all relations");

    res.status(201).json({
      success: true,
      message: "Task created successfully!",
      task: taskWithRelations
    });
  } catch (error) {
    console.error("Error in createTask:", error);
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
  createTask
};
