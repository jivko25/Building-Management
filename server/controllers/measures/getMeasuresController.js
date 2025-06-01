// server/controllers/measures/getMeasuresController.js
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Sequelize } = db;
const { Op } = Sequelize;

const getMeasures = async (req, res, next) => {
  try {
    console.log("Getting measures for user:", req.user.id);
    const isAdmin = req.user.role === "admin";
    const { q = "" } = req.query;
    const searchTerm = q ? `%${q}%` : null;

    // 1) Построяваме базовото whereClause според ролята
    let baseWhere = {};

    if (!isAdmin) {
      baseWhere = {
        [Op.or]: [
          { creator_id: req.user.id },
          { name: "hour" } // винаги включваме мярката „hour“
        ]
      };
    }

    // 2) Добавяме филтър за търсене (ако има q)
    let whereClause;
    if (searchTerm) {
      if (Object.keys(baseWhere).length === 0) {
        // Ако админ и няма предварително условие
        whereClause = { name: { [Op.like]: searchTerm } };
      } else {
        // Ако не е админ: AND между базовото условие и търсенето по име
        whereClause = {
          [Op.and]: [
            baseWhere,
            { name: { [Op.like]: searchTerm } }
          ]
        };
      }
    } else {
      // Ако няма търсене, използваме само базовото условие (което може да е {} за админ)
      whereClause = baseWhere;
    }

    // 3) Изпълняваме заявката
    const measures = await Measure.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
      distinct: true
    });

    console.log(`Found ${measures.length} measures (search="${q}")`);
    res.json({
      success: true,
      data: measures
    });
  } catch (error) {
    console.error("Error in getMeasures:", error);
    next(error instanceof ApiError ? error : new ApiError(500, "Internal server error", error));
  }
};

module.exports = {
  getMeasures
};
