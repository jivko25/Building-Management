//server\routes\tasksRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createTask } = require("../controllers/tasks/createTaskController");
const { getTasks } = require("../controllers/tasks/getTasksController");
const { getTaskById } = require("../controllers/tasks/getTaskByIdController");
const { editTask } = require("../controllers/tasks/editTaskController");

const router = express.Router();

router.get("/projects/:id/tasks", authenticateToken, getTasks);
router.get("/projects/:id/tasks/:taskId", authenticateToken, getTaskById);
router.post("/projects/:id/create-task", authenticateToken, createTask);
router.put("/projects/:id/tasks/:taskId/edit", authenticateToken, editTask);

module.exports = router;
