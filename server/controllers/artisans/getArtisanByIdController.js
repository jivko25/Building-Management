//server\controllers\artisans\getArtisanByIdController.js
const db = require("../../data/index.js");
const { Artisan, Company, User, Task, Activity, Measure } = db;

const getArtisanById = async (req, res, next) => {
    const artisan = await Artisan.findByPk(req.params.id, {
        include: [
            { model: Company, as: "company", attributes: ["name"] },
            { model: User, as: "user", attributes: ["full_name"] },
            { model: Activity, as: "activity", attributes: ["name"] },
            { model: Measure, as: "measure", attributes: ["name"] },
            {
                model: Task,
                as: "tasks",
                through: { attributes: [] }
            }
        ]
    });

    if (!artisan) {
        return res.json([]);
    }

    res.json(artisan);
};

module.exports = {
    getArtisanById
};
