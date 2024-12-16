//server\routes\measuresRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { editMeasure } = require("../controllers/measures/editMeasureController");
const { getMeasureById } = require("../controllers/measures/getMeasureByIdController");
const { createMeasure } = require("../controllers/measures/createMeasureController");
const { getMeasures } = require("../controllers/measures/getMeasuresController");

const router = express.Router();

router.get("/measures", authenticateToken, getMeasures);
router.get("/measures/:id", authenticateToken, getMeasureById);
router.post("/measures/create", authenticateToken, createMeasure);
router.put("/measures/:id/edit", authenticateToken, editMeasure);

module.exports = router;
