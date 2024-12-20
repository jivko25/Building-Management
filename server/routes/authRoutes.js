//server\routes\authRoutes.js
const express = require("express");
const { login, logout, register, forgotPassword, resetPassword } = require("../controllers/auth/authController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/auth-check", authenticateToken);

module.exports = router;
