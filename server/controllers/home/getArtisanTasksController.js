const db = require('../../data/index.js');
const { Task, Artisan } = db;
const ApiError = require('../../utils/apiError');
const getArtisanTasks = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const artisanTasks = await Task.findAll({
            include: [{
                model: Artisan,
                as: 'artisan',
                where: { user_id: userId },
                attributes: []
            }]
        });

        return res.status(200).json(artisanTasks);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server error!'));
        }
    }
};

module.exports = {
    getArtisanTasks
};
