const upload = require("../configs/multerConfig").upload;
const authenticateToken = require("../middlewares/authenticateToken");
const uploadImage = require("../controllers/images/uploadImageController").uploadImage;

const express = require("express");
const router = express.Router();
router.post("/images/upload", upload.single("image"), uploadImage);
module.exports = router;
