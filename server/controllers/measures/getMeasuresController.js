//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Project, Task, Op } = db;

const getMeasures = async (req, res, next) => {
  try {
    console.log("Getting measures for user:", req.user.id);
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
      const measures = await Measure.findAll({
        order: [["name", "ASC"]]
      });
      console.log("Admin: Returning all measures");
      return res.json({
        success: true,
        data: measures
      });
    }

    const measures = await Measure.findAll({
      creator_id: req.user.id,
      order: [["name", "ASC"]]
    });

    console.log(`Found ${measures.length} measures for user`);
    return res.json({
      success: true,
      data: measures
    });
  } catch (error) {
    console.error("Error in getMeasures:", error);
    next(error);
  }
};

module.exports = {
  getMeasures
};
