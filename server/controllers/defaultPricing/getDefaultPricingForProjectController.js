const db = require("../../data/index.js");
const ApiError = require("../../utils/apiError.js");
const { DefaultPricing } = db;

const getDefaultPricingForProject = async (req, res, next) => {
  try {
    const artisanId = req.params.id;
    const taskId = req.params.taskId;

    const task = await db.Task.findOne({
      where: {
        id: taskId
      }
    });

    const defaultPricing = await DefaultPricing.findAll({
      where: {
        artisan_id: artisanId,
        project_id: task.project_id
      },
      include: [
        {
          model: db.Activity,
          as: "activity",
          attributes: ["id", "name"]
        },
        {
          model: db.Measure,
          as: "measure",
          attributes: ["id", "name"]
        }
      ]
    });
    res.status(200).json({
      message: "Default pricing fetched successfully!",
      defaultPricing
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
  getDefaultPricingForProject
};
