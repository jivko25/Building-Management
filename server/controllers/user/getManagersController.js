//server\controllers\user\getManagersController.js
const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");

const getManagers = async (req, res, next) => {
  console.log("Starting getManagers function");

  const isAdmin = req.user.role === "admin";

  console.log(req.user);

  if (!isAdmin) {
    return next(new ApiError(403, "You are not authorized to access this resource!"));
  }

  try {
    console.log("Executing database query for managers");

    const managers = await User.findAll({
      where: {
        role: "manager"
      },
      attributes: ["id", "full_name", "username", "role", "status", "readonly", "email"]
    });

    console.log("Found managers:", managers);

    res.status(200).json({
      success: true,
      data: managers
    });
  } catch (error) {
    console.error("Error in getManagers:", error);
    next(new ApiError(500, "Error fetching managers", error));
  }
};

module.exports = {
  getManagers
};
