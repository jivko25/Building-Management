//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure } = db;

const getMeasures = async (req, res, next) => {
  try {
    const measures = await Measure.findAll({
      order: [["name", "ASC"]]
    });

    res.json({
      success: true,
      data: measures
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
  getMeasures
};
