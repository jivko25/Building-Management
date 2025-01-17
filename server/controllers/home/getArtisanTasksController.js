//server\controllers\home\getArtisanTasksController.js
const db = require("../../data/index.js");
const { Task, Artisan } = db;

const getArtisanTasks = async (req, res, next) => {
    const userId = req.user.id;

    const artisan = await Artisan.findOne({
        where: { user_id: userId }
    });

    if (!artisan) {
        return res.json([]);
    }

    const artisanTasks = await Task.findAll({
        include: [
            {
                model: Artisan,
                as: "artisans",
                where: { id: artisan.id },
                attributes: [],
                through: { attributes: [] }
            }
        ]
    });

    return res.status(200).json(artisanTasks);
};

module.exports = {
    getArtisanTasks
};
