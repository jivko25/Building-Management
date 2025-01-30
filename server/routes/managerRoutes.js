//server\routes\managerRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { getManagerReports } = require("../controllers/managers/getManagerReports");

const router = express.Router();

router.get("/managers/getReports/", getManagerReports);

module.exports = router;
