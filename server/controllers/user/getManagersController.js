//server\controllers\user\getManagersController.js
const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");

const getManagers = async (req, res, next) => {
  const isAdmin = req.user.role === "admin";

  if (!isAdmin) {
    return next(new ApiError(403, "You are not authorized to access this resource!"));
  }

  try {
    const managers = await User.findAll({
      where: {
        role: "manager"
      },
      attributes: ["id", "full_name", "username", "role", "status", "readonly", "email"]
    });

    res.status(200).json({
      success: true,
      data: managers
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Error fetching managers", error));
    }
  }
};

module.exports = {
  getManagers
};
