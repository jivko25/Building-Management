//server\routes\projectRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createProject } = require("../controllers/projects/createProjectController");
const { editProject } = require("../controllers/projects/editProjectController");
const { getProjectById } = require("../controllers/projects/getProjectByIdController");
const { getProjects, getPaginatedProjects } = require("../controllers/projects/getProjectsController");
const { getMyProjects } = require("../controllers/projects/getProjectsForManager");

const router = express.Router();

router.get("/projects/paginated", authenticateToken, getPaginatedProjects);
router.get("/projects-for-manager", authenticateToken, getMyProjects);
router.post("/projects/create", authenticateToken, createProject);
router.get("/projects/:id", authenticateToken, getProjectById);
router.put("/projects/:id/edit", authenticateToken, editProject);
router.get("/projects", authenticateToken, getProjects);

module.exports = router;
