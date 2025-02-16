//server\controllers\user\editUserController.js
const db = require("../../data/index.js");
const User = db.User;
const { Op } = db.Sequelize;
const hashPassword = require("../../utils/hashPassword");
const ApiError = require("../../utils/apiError");

const editUser = async (req, res, next) => {
  console.log("Editing user with ID:", req.params.id);
  const userId = req.params.id;
  const { full_name, username, password, email, role, status } = req.body;

  try {
    const user = await User.findByPk(userId);
    console.log("Found user:", user);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    // Update user fields
    if (full_name) {
      if (full_name.trim() === "") {
        throw new ApiError(400, "Full name cannot be empty.");
      }
      user.full_name = full_name;
    }

    if (username) {
      const existingUser = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userId }
        }
      });
      if (existingUser) {
        throw new ApiError(400, "Username already exists.");
      }
      user.username = username;
    }

    if (password) {
      user.hashedPassword = await hashPassword(password);
    }

    if (role) {
      user.role = role;
    }

    if (email) {
      user.email = email;
    }

    if (status) {
      if (status === "active" || status === "inactive") {
        user.status = status;
      }
    }

    await user.save();
    console.log("User updated successfully");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        status: user.status,
        manager_id: user.manager_id,
        creator_id: user.creator_id
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
};

module.exports = {
  editUser
};
