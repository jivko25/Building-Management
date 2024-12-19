//server\routes\userRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { getUsers } = require("../controllers/user/getUsersController");
const { getUserById } = require("../controllers/user/getUserByIdController");
const { getAllActiveUsers } = require("../controllers/user/getAllActiveUsers");
const { editUser } = require("../controllers/user/editUserController");
const { createUser } = require("../controllers/user/createUserController");
const { getManagers } = require("../controllers/user/getManagersController");
const { addManagerToReadonly, removeManagerFromReadonly } = require("../controllers/user/updateManagerReadonlyController");

const router = express.Router();

router.get("/users/managers", authenticateToken, getManagers);
router.patch("/users/managers/add-to-readonly/:id", authenticateToken, addManagerToReadonly);
router.patch("/users/managers/remove-from-readonly/:id", authenticateToken, removeManagerFromReadonly);
router.get("/users/active", authenticateToken, getAllActiveUsers);
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, getUserById);
router.post("/users/create", authenticateToken, createUser);
router.put("/users/:id/edit", authenticateToken, editUser);

module.exports = router;
