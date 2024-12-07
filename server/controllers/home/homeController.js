const db = require('../../data/index.js');
const { Artisan, Project, Task, Activity, WorkItem } = db;  
const ApiError = require('../../utils/apiError');

const homePage = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const result = await Project.findAll({
            include: [{
                model: Task,
                required: true,
                include: [{
                    model: Artisan,
                    where: { user_id: userId },
                    required: true
                }, {
                    model: Activity
                }, {
                    model: WorkItem
                }]
            }]
        });

        if (!result.length) {
            throw new ApiError(404, 'No tasks assigned to this artisan');
        }

        res.json(result);

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server error!', error));
        }
    }
};

module.exports = {
    homePage
};
