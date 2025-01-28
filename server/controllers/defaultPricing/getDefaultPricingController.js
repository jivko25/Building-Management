const { Op } = require("sequelize");
const db = require("../../data/index.js");
const ApiError = require("../../utils/apiError.js");
const { DefaultPricing, Activity, Measure } = db;

const getDefaultPricing = async (req, res, next) => {
  try {
    const artisanId = req.params.id;
    const { id, role } = req.user;

    if (role !== "manager" && role !== "admin") {
      return next(new ApiError(403, "Forbidden!"));
    }

    let defaultPricing;

    if (role === "manager" && !artisanId) {
      defaultPricing = await DefaultPricing.findAll({
        where: {
          creator_id: id,
          artisan_id: { [Op.is]: null }
        },
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
      defaultPricing = await DefaultPricing.findAll({
        where: {
          artisan_id: artisanId
        },
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
