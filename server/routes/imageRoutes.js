const upload = require("../configs/multerConfig").upload;
const { deleteImage } = require("../controllers/images/deleteImageController");
const { getAllImagesByProject } = require("../controllers/images/getAllImagesByProjectController");
const authenticateToken = require("../middlewares/authenticateToken");
const uploadImage = require("../controllers/images/uploadImageController").uploadImage;

const express = require("express");
const router = express.Router();
router.post("/images/upload/:project_id", upload.single("image"), uploadImage);
router.get("/images/:project_id", authenticateToken, getAllImagesByProject);
router.delete("/images/:image_id", deleteImage);
module.exports = router;
