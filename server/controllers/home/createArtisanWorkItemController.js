const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, DefaultPricing, Activity, Measure, Artisan } = db;
const ApiError = require("../../utils/apiError");

const createWorkItem = async (req, res, next) => {
  const taskId = req.params.taskId;
  const {
    artisan,
    default_pricing,
    end_date,
    note,
    quantity,
    start_date,
    status,
    hours,
    project_id
  } = req.body;

  try {
    // Намери default_pricing на база ID
    const defaultPrice = await DefaultPricing.findOne({
      where: { id: default_pricing },
      include: [
        { model: Activity, as: "activity" },
        { model: Measure, as: "measure" }
      ]
    });

    if (!defaultPrice) {
      throw new ApiError(404, "Default pricing not found!");
    }

    // Намери мениджърската цена
    const managerDefaultPrice = await DefaultPricing.findOne({
      where: {
        project_id: defaultPrice.project_id,
        activity_id: defaultPrice.activity_id,
        artisan_id: { [Op.is]: null },
        artisan_price: { [Op.is]: null }
      }
    });

    const foundedArtisan = await Artisan.findOne({
      where: {
        user_id: req.user.id
      }
    })

    if (!foundedArtisan.id) {
      throw new ApiError(404, "Artisan not found!");
    }

    // Намери часова ставка
    const hourDefaultPrice = await DefaultPricing.findOne({
      where: {
        project_id,
        activity_id: 1, // Предполага се, че 1 е ID за activity "часова ставка"
        measure_id: 1, // Предполага се, че 1 е ID за measure "час"
        artisan_id: foundedArtisan.id
      }
    });

    if (hours && !hourDefaultPrice?.id) {
      throw new ApiError(404, "Hourly default pricing not found!");
    }

    let single_artisan_price;
    let single_manager_price;

    let total_artisan_price;
    let total_manager_price;

    // Ако са зададени часове, изчисли тоталната стойност за artisan
    if (hours) {
      single_artisan_price = hourDefaultPrice.artisan_price;
      total_artisan_price = single_artisan_price * hours;
    } else {
      single_artisan_price = defaultPrice.artisan_price;
      total_artisan_price = single_artisan_price * quantity;
    }

    // Изчисли тоталната стойност за manager
    single_manager_price = (managerDefaultPrice && managerDefaultPrice.manager_price) || defaultPrice.manager_price;
    total_manager_price = single_manager_price * quantity;

    // Създаване на нов WorkItem
    const newWorkItem = await WorkItem.create({
      task_id: taskId,
      start_date,
      end_date,
      note,
      status,
      quantity,
      activity_id: defaultPrice.activity_id,
      measure_id: defaultPrice.measure_id,
      project_id: defaultPrice.project_id,
      artisan_id: foundedArtisan.id,
      total_artisan_price,
      total_manager_price,
      creator_id: req.user.id,
      hours
    });

    res.status(201).json({
      message: "Work item created successfully!",
      workItem: newWorkItem
    });
  } catch (error) {
    console.log(error.message);

    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Error creating the work item!", error));
    }
  }
};

module.exports = {
  createWorkItem
};
