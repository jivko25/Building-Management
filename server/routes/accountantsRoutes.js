//server\routes\accountantsRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { getAccountants, getPaginatedAccountants } = require("../controllers/accountants/getAccountantsController");
const { getAccountantById } = require("../controllers/accountants/getAccountantByIdController");
const { createAccountant } = require("../controllers/accountants/createAccountantController");
const { editAccountant } = require("../controllers/accountants/editAccountantController");

const router = express.Router();

router.get("/accountants", authenticateToken, getPaginatedAccountants);
router.get("/accountants", authenticateToken, getAccountants);
router.get("/accountants/:id", authenticateToken, getAccountantById);
router.post("/accountants", authenticateToken, createAccountant);
router.put("/accountants/:id", authenticateToken, editAccountant);

module.exports = router;