const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { createUser } = require('../controllers/user/createUserController');
const { editUser } = require('../controllers/user/editUserController');
const { getUserById } = require('../controllers/user/getUserByIdController');
const { getUsers } = require('../controllers/user/getUsersController');

const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.get('/users/:id', authenticateToken, getUserById);
router.post('/users/create', authenticateToken, createUser);
router.put('/users/:id/edit', authenticateToken, editUser);

module.exports = router;