const express = require("express");
const router = express.Router();
const { getLanguages } = require("../controllers/languages/getLanguagesController");
const { getLanguageById } = require("../controllers/languages/getLanguageByIdController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken, getLanguages);
router.get("/:id", authenticateToken, getLanguageById);

module.exports = router;
