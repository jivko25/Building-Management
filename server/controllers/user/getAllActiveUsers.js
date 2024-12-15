//server\controllers\user\getAllActiveUsers.js
const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");

const getAllActiveUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        status: "active"
      },
      attributes: ["id", "full_name", "username", "role", "status", "manager_id"]
    });

    res.json(users);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error!", error));
    }
  }
};

module.exports = {
  getAllActiveUsers
};
