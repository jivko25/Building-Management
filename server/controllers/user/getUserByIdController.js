//server\controllers\user\getUserByIdController.js
const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: ["id", "full_name", "username", "role", "status", "manager_id"]
    }); //think about if the current user is admin, he can see all users, if not (so the current user is manager), he can see only his users, and if the current user is user, he can see only himself
    if (!user) throw new ApiError(404, "User not found.");
    res.json(user);
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
};

module.exports = {
  getUserById
};
