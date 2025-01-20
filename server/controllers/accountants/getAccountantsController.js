//server\controllers\accountants\getAccountantsController.js
const db = require("../../data/index.js");
const { Accountant, User, Sequelize, Company } = db;
const { Op } = Sequelize;
const ApiError = require("../../utils/apiError");

const getPaginatedAccountants = async (req, res, next) => {
  try {
    const { _page = 1, _limit = 10, q = "" } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const isAdmin = req.user.role === "admin";

    const users = await User.findAll({
      where: {
        manager_id: req.user.id
      }
    });

    if (users.length === 0 && !isAdmin) {
      throw new ApiError(404, "You are not authorized to access this resource");
    }

    if (req.user.role === "manager") {  
      const accountants = await Accountant.findAll({
        where: {
          user_id: {
            [Op.in]: users.map((user) => user.id)
          }
        }
      });

      return res.json(accountants);
    }

    const whereClause = q
      ? {
        name: {
          [Op.like]: `%${q}%`
        }
      }
      : {};

    const rows = await Accountant.findAll({
      where: whereClause,
      include: [
        { model: Company, as: "company", attributes: ["name"] },
        { model: User, as: "user", attributes: ["full_name"] }
      ],
      limit: parseInt(_limit),
      offset: offset,
      order: [["id", "DESC"]]
    });

    const accountants = rows.filter((accountant) => {
      if (isAdmin) {
        return true;
      }
      return accountant.user_id === req.user.id;
    });

    res.json({
      accountants: accountants,    
      accountantsCount: accountants.length,
      page: parseInt(_page),
      limit: parseInt(_limit),
      totalPages: Math.ceil(accountants.length / parseInt(_limit))
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    }
    next(new ApiError(500, "Internal server Error!"));
  }
};

const getAccountants = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";

    const users = await User.findAll({
      where: {
        manager_id: req.user.id
      }
    });

    if (users.length === 0) {
      throw new ApiError(404, "You are not authorized to access this resource");
    }

    let accountants;
    if (!isAdmin) {
      accountants = await Accountant.findAll({
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
          user_id: {
            [Op.in]: users.map((user) => user.id)
          }
        },
        order: [["id", "DESC"]]
      });
    } else {
      accountants = await Accountant.findAll({
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

    res.json(accountants);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    }
    next(new ApiError(500, "Internal server Error!"));
  }
};

module.exports = {
  getPaginatedAccountants,
  getAccountants
};