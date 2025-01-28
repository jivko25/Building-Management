//server\controllers\artisans\getArtisanByIdController.js
const { where } = require("sequelize");
const db = require("../../data/index.js");
const { Artisan, Company, User, Task, Activity, Measure } = db;

const getUserArtisanId = async (req, res, next) => {
  const userId = req.user.id;
  const artisanId = await Artisan.findOne({
    where: {
      user_id: userId
    },
    attributes: ["id"]
  });

  res.json(artisanId);
};

module.exports = {
  getUserArtisanId
};
