//server\controllers\measures\getMeasuresController.js\
const ApiError = require("../../utils/apiError");
const db = require("../../data/index.js");
const { Measure, Project, Task } = db;

const getMeasures = async (req, res, next) => {
    const isAdmin = req.user.role === "admin";

    if (isAdmin) {
        const measures = await Measure.findAll({
            order: [["name", "ASC"]]
        });

        return res.json({
            success: true,
            data: measures
        });
    }

    const measures = await Measure.findAll({
      order: [["name", "ASC"]]
    });

    res.json({
        success: true,
        data: measures
    });
};

module.exports = {
    getMeasures
};
