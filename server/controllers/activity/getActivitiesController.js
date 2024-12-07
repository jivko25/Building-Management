const db = require('../../data/index.js');
const Activity = db.Activity;
const { Op } = db.Sequelize;
const ApiError = require('../../utils/apiError');

const getPaginatedActivities = async (req, res, next) => {
    const { _page = 1, _limit = 10, q = '' } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const whereClause = q ? { name: { [Op.like]: `%${q}%` } } : {};

    try {
        const { count: total, rows: data } = await Activity.findAndCountAll({
            where: whereClause,
            limit: parseInt(_limit),
            offset: offset
        });

        res.json({
            data,
            total,
            page: parseInt(_page),
            limit: parseInt(_limit),
            totalPages: Math.ceil(total / parseInt(_limit))
        });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server error!', error));
        }
    }
};

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.findAll();
        res.json(activities);
    } catch (error) {
        throw new ApiError(500, 'Internal server error!', error);
    }
};

module.exports = {
    getPaginatedActivities,
    getActivities
};