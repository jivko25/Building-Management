//server\controllers\artisans\getArtisanByIdController.js
const db = require("../../data/index.js");
const { Artisan, Company, User, Task, Activity, Measure } = db;
const ApiError = require("../../utils/ApiError.js");

const getArtisanById = async (req, res, next) => {
  try {
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
      throw new ApiError(404, "Artisan not found!");
    }

    res.json(artisan);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getArtisanById
};
