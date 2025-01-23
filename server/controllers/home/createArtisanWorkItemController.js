const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, DefaultPricing, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const createWorkItem = async (req, res, next) => {
  const taskId = req.params.taskId;
  const { defaultPriceId, activity, end_date, finished_work, name, note, quantity, start_date, status } = req.body;

  try {
    // Намери defaultPrice на база defaultPriceId
    const defaultPrice = await DefaultPricing.findOne({
      where: { id: defaultPriceId },
      include: [
        { model: Activity, as: "activity" },
        { model: Measure, as: "measure" }
      ]
    });

    const managerDefaultPrice = await DefaultPricing.findOne({
      where: {
        project_id: defaultPrice.project_id,
        activity_id: defaultPrice.activity_id,
        artisan_id: { [Op.is]: null },
        artisan_price: { [Op.is]: null }
      }
    });

    if (!defaultPrice) {
      throw new ApiError(404, "Default pricing not found!");
    }
    
    const single_artisan_price = defaultPrice.artisan_price;
    const single_manager_price = (managerDefaultPrice && managerDefaultPrice.manager_price) || defaultPrice.manager_price;

    const total_artisan_price = single_artisan_price * quantity;
    const total_manager_price = single_manager_price * quantity;
    
    // Създай нов WorkItem с релации към activity и measure
    const newWorkItem = await WorkItem.create({
      task_id: taskId,
      name,
      start_date,
      end_date,
      note,
      finished_work,
      status,
      quantity,
      activity_id: defaultPrice.activity_id,
      measure_id: defaultPrice.measure_id,
      project_id: defaultPrice.project_id,
      artisan_id: defaultPrice.artisan_id,
      total_artisan_price,
      total_manager_price,
    });

    res.status(201).json({
      message: "Work item created successfully!",
      workItem: newWorkItem
    });
  } catch (error) {
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
