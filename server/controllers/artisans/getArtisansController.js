//server\controllers\artisans\getArtisansController.js
const db = require("../../data/index.js");
const { Artisan, Company, User, Task, Sequelize, Project } = db;
const ApiError = require("../../utils/apiError");
const { Op } = Sequelize;

const getPaginatedArtisans = async (req, res, next) => {
  try {
    console.log("Getting paginated artisans for user:", req.user.id);
    const { _page = 1, _limit = 10, q = "" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const isAdmin = req.user.role === "admin";

    const users = await User.findAll({
      where: {
        manager_id: req.user.id
      }
    });

    if (users.length === 0) {
      throw new ApiError(404, "You are not authorized to access this resource");
    }

    const whereClause = q
      ? {
        name: {
          [Op.like]: `%${q}%`
        },
      }
      : {};

    const rows = await Artisan.findAll({
      where: {
        ...whereClause,
        ...(isAdmin ? {} : { creator_id: req.user.id })
      },
      include: [
        { model: Company, as: "company", attributes: ["name"] },
        { model: User, as: "user", attributes: ["full_name"] },
        {
          model: Task,
          as: "tasks",
          through: { attributes: [] }
        }
      ],
      limit: parseInt(_limit),
      offset: offset,
      order: [["id", "DESC"]]
    });

    // const artisans = rows.filter((artisan) => {
    //   if (isAdmin) {
    //     return true;
    //   }
    //   return artisan.user_id === req.user.id;
    // });

    res.json({
      artisans: rows,
      artisansCount: rows.length,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(rows.length / parseInt(_limit))
    });
  } catch (error) {
    console.error("Error in getPaginatedArtisans:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

const getArtisans = async (req, res, next) => {
  try {
    console.log("Getting all artisans for user:", req.user.id);
    const isAdmin = req.user.role === "admin";

    const users = await User.findAll({
      where: {
        manager_id: req.user.id
      }
    });

    if (users.length === 0) {
      throw new ApiError(404, "You are not authorized to access this resource");
    }


    let artisans;
    if (!isAdmin) {
      artisans = await Artisan.findAll({
        include: [
          {
            model: Company,
            as: "company",
            attributes: ["name"]
          },
          {
            model: User,
            as: "user",
            attributes: ["full_name"]
          }
        ],
        where: {
          creator_id: req.user.id
        },
        order: [["id", "DESC"]]
      });
    } else {
      artisans = await Artisan.findAll({
        include: [
          {
            model: Company,
            as: "company",
            attributes: ["name"]
          },
          {
            model: User,
            as: "user",
            attributes: ["full_name"]
          }
        ]
      });
    }

    console.log(`Found ${artisans.length} total artisans`);
    res.json(artisans);
  } catch (error) {
    console.error("Error in getArtisans:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getPaginatedArtisans,
  getArtisans
};
