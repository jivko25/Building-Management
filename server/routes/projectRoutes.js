//server\routes\projectRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createProject } = require("../controllers/projects/createProjectController");
const { editProject } = require("../controllers/projects/editProjectController");
const { getProjectById } = require("../controllers/projects/getProjectByIdController");
const { getProjects, getPaginatedProjects } = require("../controllers/projects/getProjectsController");
const { getMyProjects } = require("../controllers/projects/getProjectsForManager");
const { getWeeklyReports } = require('../controllers/projects/getWeeklyReportsController');
const { getProjectSummary } = require("../controllers/projects/getProjectSummaryController");

const router = express.Router();

// Специфични раутове първо
router.get("/:projectId/reports/weekly", authenticateToken, getWeeklyReports);

// След това по-общите раутове
router.get("/projects/paginated", authenticateToken, getPaginatedProjects);
router.get("/projects-for-manager", authenticateToken, getMyProjects);
router.post("/projects/create", authenticateToken, createProject);
router.get("/projects/:id", authenticateToken, getProjectById);
router.put("/projects/:id/edit", authenticateToken, editProject);
router.get("/projects", authenticateToken, getProjects);
router.get("/:projectId/summary", authenticateToken, getProjectSummary);

module.exports = router;
