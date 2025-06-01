// server/controllers/measures/deleteMeasureController.js
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, WorkItem, DefaultPricing } = db; // добавяме връзките към другите модели

const deleteMeasure = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1) Проверяваме дали мярката съществува
    const measure = await Measure.findByPk(id);
    if (!measure) {
      return next(new ApiError(404, "Measure not found"));
    }

    // 2) Проверяваме за свързани workitems
    const relatedWorkItem = await WorkItem.findOne({
      where: { measure_id: id }
    });
    if (relatedWorkItem) {
      return next(
        new ApiError(
          400,
          "Cannot delete measure: there are work items associated with it"
        )
      );
    }

    // 3) Проверяваме за свързан default_pricing
    const relatedDefaultPricing = await DefaultPricing.findOne({
      where: { measure_id: id }
    });
    if (relatedDefaultPricing) {
      return next(
        new ApiError(
          400,
          "Cannot delete measure: there are default pricing entries associated with it"
        )
      );
    }

    // 4) Ако няма зависимости, изтриваме записа
    await measure.destroy();

    // 5) Връщаме статус 204 No Content
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting measure:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};

module.exports = {
  deleteMeasure,
};
