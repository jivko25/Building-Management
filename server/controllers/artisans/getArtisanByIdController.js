//server\controllers\artisans\getArtisanByIdController.js
const { Sequelize } = require("sequelize");
const db = require("../../data/index.js");
const { Artisan, Company, User, Task, Activity, Measure, WorkItem, Project } = db;

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

const getArtisansWorkItems = async (req, res, next) => {
    const { id } = req.params;

    const artisan = await Artisan.findByPk(id);
    try {
        const workItems = await WorkItem.findAll({
            attributes: [
              "id", 
              "name", 
              "total_artisan_price", 
              "total_manager_price", 
              "quantity",
              "created_at",
              "is_paid",
              [Sequelize.literal('ROUND(total_artisan_price / quantity, 2)'), 'single_artisan_price'],
              [Sequelize.literal('ROUND(total_manager_price / quantity, 2)'), 'single_manager_price'] 
            ],
            where: { creator_id: id },
            include: [
              {
                model: Task,
                as: "task",
                attributes: ["id", "name", "project_id"],
                include: [
                  {
                    model: Project,
                    as: "project",
                    attributes: ["id", "name"]
                  },
                  {
                    model: Activity,
                    as: "activity",
                    attributes: ["id", "name"]
                  }
                ]
              }
            ],
            order: [["created_at", "DESC"]]
          });
        res.json({workItems, artisan_name: artisan.name});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getArtisanById,
    getArtisansWorkItems
};
