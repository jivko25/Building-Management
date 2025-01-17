//server\controllers\measures\getMeasureByIdController.js
const db = require("../../data/index.js");
const { Measure } = db;

const getMeasureById = async (req, res, next) => {
    const { id } = req.params;

    const measure = await Measure.findByPk(id);

    if (!measure) {
        return res.json([]);
    }

    res.json({
        success: true,
        data: measure
    });
};

module.exports = {
    getMeasureById
};
