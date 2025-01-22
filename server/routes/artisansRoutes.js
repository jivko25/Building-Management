//server\routes\artisansRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { createArtisan } = require("../controllers/artisans/createArtisanController");
const { editArtisan } = require("../controllers/artisans/editArtisanController");
const { getArtisanById, getArtisansWorkItems } = require("../controllers/artisans/getArtisanByIdController");
const { getArtisans, getPaginatedArtisans } = require("../controllers/artisans/getArtisansController");

const router = express.Router();

router.get("/artisans", authenticateToken, getPaginatedArtisans);
router.get("/artisans", authenticateToken, getArtisans);
router.get("/artisans/:id", authenticateToken, getArtisanById);
router.get("/artisans/:id/workitems", getArtisansWorkItems);
router.post("/artisans/create", authenticateToken, createArtisan);
router.put("/artisans/:id/edit", authenticateToken, editArtisan);

module.exports = router;
