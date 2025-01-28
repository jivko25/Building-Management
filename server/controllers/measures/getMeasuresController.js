//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Project, Task, Op } = db;

const getMeasures = async (req, res, next) => {
  try {
    console.log("Getting measures for user:", req.user.id);
    const isAdmin = req.user.role === "admin";

    // Get base query for all users
    let whereClause = {};
    let order = [["name", "ASC"]];

    if (!isAdmin) {
      whereClause = {
        [Op.or]: [
          { creator_id: req.user.id },
          { name: "hour" } // Always include 'hour' measure
        ]
      };
    }

    const measures = await Measure.findAll({
      where: whereClause,
      order: order,
      distinct: true // Prevent duplicates
    });

    console.log(`Found ${measures.length} measures`);
    res.json({
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
