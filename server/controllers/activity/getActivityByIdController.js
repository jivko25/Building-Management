//server\controllers\activity\getActivityByIdController.js
const db = require("../../data/index.js");
const Activity = db.Activity;

const getActivityById = async (req, res, next) => {
    const activityId = req.params.id;

    const activity = await Activity.findByPk(activityId);

    if (!activity) {
        return res.json([]);
    }

    res.json(activity);
};

module.exports = {
    getActivityById
};
