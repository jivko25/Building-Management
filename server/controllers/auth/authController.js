//server\controllers\auth\authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../data/index.js");
const { createEmail } = require("../../utils/email");
const User = db.User;
const { generateTokenSetCookie } = require("../../utils/generateTokenCookieSetter");
const ApiError = require("../../utils/apiError");

// Login function
const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  try {
    const user = await User.findOne({
      where: {
        username: username,
        status: "active"
      }
    });

    // Check if user exists
    if (!user) {
      console.log("No user found with the provided username");
      throw new ApiError(401, "Invalid username or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordCorrect) {
      console.log("Password does not match for the provided username");
      throw new ApiError(401, "Invalid username or password");
    }

    generateTokenSetCookie(res, user);

    res.status(201).json({
      success: "true",
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error", error));
    }
  }
};

// Registration function
const register = async (req, res, next) => {
  const { username, password, full_name, creator_id, email } = req.body;

  if (!username || !password || !full_name || !email) {
    throw new ApiError(400, "All fields are required");
  }
  
  try {
    const existingUser = await User.findOne({
      where: {
        username: username
      }
    });
  
    // Check if username already exists
    if (existingUser) {
      console.log("Username already exists");
      throw new ApiError(409, "Username already exists");
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = await User.create({
      username: username,
      hashedPassword: hashedPassword,
      full_name: full_name,
      role: 'manager',
      status: "active",
      creator_id: creator_id || null,
      email: email
    });
  
    generateTokenSetCookie(res, newUser);
  
    res.status(201).json({
      success: "true",
      message: "Registration successful",
      user: {
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
        status: newUser.status,
        creator_id: newUser.creator_id,
        email: newUser.email
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server error", error));
    }
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "prod",
    sameSite: "strict"
  });
  res.status(200).json({
    success: true,
    message: "Logged out"
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    const emailResponse = await createEmail(
      email,
      "Password reset token",
      message
    );

    res.status(200).json({
      success: true,
      message: emailResponse
    });
};

const resetPassword = async (req, res, next) => {
  const { newPassword, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;


    const user = await User.findByPk(userId);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.hashedPassword = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    return next(new ApiError(400, "Invalid or expired token"));
  }
};

module.exports = {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword
};
