//server\controllers\home\editArtisanWorkItemController.js
const { Op } = require("sequelize");
const db = require("../../data/index.js");
const { WorkItem, DefaultPricing, Activity, Measure, Artisan } = db;
const ApiError = require("../../utils/apiError");

const editWorkItem = async (req, res, next) => {
  const workItemId = req.params.id;
  const taskId = req.params.taskId;
  const { 
    artisan, 
    default_pricing, 
    quantity, 
    hours, 
    start_date, 
    end_date, 
    note, 
    status,
    project_id: projectId
  } = req.body;

  try {
    const existingWorkItem = await WorkItem.findByPk(workItemId);

    if (!existingWorkItem) {
      throw new ApiError(404, "Work item not found!");
    }

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
        id: artisan
      }
    });

    console.log(foundedArtisan, 'foundedArtisan');
    

    if (!foundedArtisan.id) {
      throw new ApiError(404, "Artisan not found!");
    }

    // Намери часова ставка
    const hourDefaultPrice = await DefaultPricing.findOne({
      where: {
        project_id: projectId,
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

    // Обновяваме work item
    const updateData = {
      task_id: taskId,
      project_id: projectId,
      start_date,
      end_date,
      note,
      status,
      quantity,
      activity_id: defaultPrice.activity_id,
      measure_id: defaultPrice.measure_id,
      artisan_id: foundedArtisan.id,
      total_artisan_price,
      total_manager_price,
      hours
    };

    await existingWorkItem.update(updateData);

    // Зареждаме обновения work item с всички връзки
    const updatedWorkItem = await WorkItem.findByPk(workItemId, {
      include: ['artisan', 'activity', 'measure']
    });

    res.status(200).json(updatedWorkItem);
  } catch (error) {
    console.error("Error updating work item:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Error updating the work item!", error));
    }
  }
};

const updateIsPaidWorkItem = async function (req, res, next) {
  const workItemId = req.params.id;
  const { is_paid } = req.body;

  try {
      const workItem = await WorkItem.findOne({
          where: { id: workItemId }
      });

      if (!workItem) {
          return res.status(404).json({ error: "Work item not found!" });
      }

      workItem.is_paid = is_paid;
      await workItem.save();

      return res.status(200).json({
          message: "Work item updated successfully!",
          data: workItem
      });
  } catch (error) {
      next(error);
  }
};

module.exports = {
  editWorkItem,
  updateIsPaidWorkItem
};

