//server\routes\workItemRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createWorkItem } = require("../controllers/workItems/createWorkItemController");
const { getWorkItems } = require("../controllers/workItems/getWorkItemsController");
const { getWorkItemById } = require("../controllers/workItems/getWorkItemControllerById");
const { editWorkItem, updateIsPaidWorkItem } = require("../controllers/workItems/editWorkItemController");
const { deleteWorkItem } = require("../controllers/workItems/deleteWorkItemController");

const router = express.Router();

router.get("/projects/:project_id/tasks/:task_id/work-items", authenticateToken, getWorkItems);
router.get("/projects/:project_id/tasks/:task_id/workItems/:id", authenticateToken, getWorkItemById);
router.post("/projects/:project_id/tasks/:task_id/workItems/create", authenticateToken, createWorkItem);
router.put("/projects/:project_id/tasks/:task_id/work-items/:id/edit", authenticateToken, editWorkItem);
router.patch("/work-items/:id/is-paid", authenticateToken, updateIsPaidWorkItem)
router.delete("/projects/:project_id/tasks/:task_id/work-items/:id", authenticateToken, deleteWorkItem);

module.exports = router;
