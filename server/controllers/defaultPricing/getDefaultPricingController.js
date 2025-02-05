const { Op } = require("sequelize");
const db = require("../../data/index.js");
const ApiError = require("../../utils/apiError.js");
const { DefaultPricing, Activity, Measure } = db;

const getDefaultPricing = async (req, res, next) => {
  try {
    const artisanId = req.params.id;
    const { id, role } = req.user;
    const { project_id } = req.query;

    if (role !== "manager" && role !== "admin") {
      return next(new ApiError(403, "Forbidden!"));
    }

    let whereClause = {};
    let defaultPricing;

    if (role === "manager" && !artisanId) {
      whereClause = {
        creator_id: id,
        artisan_id: { [Op.is]: null }
      };
      if (project_id) {
        whereClause.project_id = project_id;
      }

      defaultPricing = await DefaultPricing.findAll({
        where: whereClause,
        include: [
          {
            model: Activity,
            as: "activity",
            attributes: ["id", "name"],
            required: true
          },
          {
            model: Measure,
            as: "measure",
            attributes: ["id", "name"],
            required: true
          }
        ]
      });
    } else {
      whereClause = {
        artisan_id: artisanId
      };
      if (project_id) {
        whereClause.project_id = project_id;
      }

      defaultPricing = await DefaultPricing.findAll({
        where: whereClause,
        include: [
          { model: Activity, as: "activity", attributes: ["name"] },
          { model: Measure, as: "measure", attributes: ["name"] }
        ]
      });
    }

    res.status(200).json({
      success: true,
      status: "success",
      message: "Default pricing fetched successfully!",
      data: defaultPricing
    });
  } catch (error) {
    console.error("Error in getDefaultPricing:", error);
    next(new ApiError(500, error.message || "Internal server Error!"));
  }
};

module.exports = {
  getDefaultPricing
};
