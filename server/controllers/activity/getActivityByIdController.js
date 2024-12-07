const db = require('../../data/index.js');
const Activity = db.Activity;
const ApiError = require('../../utils/apiError');

const getActivityById = async (req, res, next) => {
    const activityId = req.params.id;

    try {
        const activity = await Activity.findByPk(activityId);
        
        if (!activity) {
            throw new ApiError(404, 'Activity not found!');
        }

        res.json(activity);
    }
    catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server error!', error));
        }
    }
};

module.exports = {
    getActivityById
};