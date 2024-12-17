//server\controllers\user\createUserController.js
const hashPassword = require("../../utils/hashPassword");
const db = require("../../data/index.js");
const User = db.User;
const ApiError = require("../../utils/apiError");

const createUser = async (req, res, next) => {
  console.log("Creating new user with data:", req.body);
  const { full_name, username, password, role, status } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ApiError(400, "Username already exists!");
    }

    const hashedPassword = await hashPassword(password);

    let manager_id = null;
    if (role === "user" && req.user?.role === "manager") {
      manager_id = req.user.id;
    }

    const newUser = await User.create({
      full_name,
      username,
      hashedPassword,
      role,
      status,
      manager_id,
      creator_id: req.user?.id
    });

    console.log("User created successfully:", {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      creator_id: newUser.creator_id
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
        manager_id: newUser.manager_id,
        creator_id: newUser.creator_id
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal Server Error", error));
    }
  }
};

module.exports = {
  createUser
};
