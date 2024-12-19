const express = require("express");

const { sendMail } = require("../controllers/emailService/emailService");
const router = express.Router();


router.post("/send-email", sendMail);

module.exports = router;