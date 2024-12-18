//server\controllers\home\getArtisanTasksController.js
const db = require("../../data/index.js");
const { Task, Artisan } = db;
const ApiError = require("../../utils/apiError");
const getArtisanTasks = async (req, res, next) => {
  const userId = req.user.id;
  console.log("Getting tasks for user:", userId);

  try {
    const artisan = await Artisan.findOne({
      where: { user_id: userId }
    });

    if (!artisan) {
      console.log("No artisan found for user:", userId);
      throw new ApiError(404, "Artisan not found!");
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

    console.log("Found tasks:", artisanTasks.length);
    return res.status(200).json(artisanTasks);
  } catch (error) {
    console.error("Error in getArtisanTasks:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!"));
    }
  }
};

module.exports = {
  getArtisanTasks
};
