//server\routes\projectRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createProject } = require("../controllers/projects/createProjectController");
const { editProject } = require("../controllers/projects/editProjectController");
const { getProjectById } = require("../controllers/projects/getProjectByIdController");
const { getProjects } = require("../controllers/projects/getProjectsController");

const router = express.Router();

router.get("/projects", authenticateToken, getProjects);
router.get("/projects/:id", authenticateToken, getProjectById);
router.post("/projects/create", authenticateToken, createProject);
router.put("/projects/:id/edit", authenticateToken, editProject);

module.exports = router;
