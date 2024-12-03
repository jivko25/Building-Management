const express = require('express');
const { login, logout } = require('../controllers/auth/authController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/auth-check', authenticateToken);

module.exports = router;