const db = require("../../data/index.js");
const { Accountant, User, Company, TaskAccountant, Task, Measure } = db;
const ApiError = require("../../utils/apiError");

const getAccountantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";

    // Check if user has access to this resource
    if (!isAdmin) {
      const users = await User.findAll({
        where: {
          manager_id: req.user.id
        }
      });

      if (users.length === 0) {
        throw new ApiError(404, "You are not authorized to access this resource");
      }
    }

    const accountant = await Accountant.findOne({
      where: { id },
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
        },
        {
          model: Measure,
          as: "measure",
          attributes: ["name"]
        }
      ]
    });

    if (!accountant) {
      throw new ApiError(404, "Accountant not found");
    }

    // Check if user has access to this specific accountant
    if (!isAdmin && !accountant.user_id) {
      throw new ApiError(403, "You don't have access to this accountant");
    }

    res.json(accountant);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(500, "Internal Server Error!"));
  }
};

module.exports = {
  getAccountantById
}; 