// Used for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");

// Memmory storage, so we keep images in memory, before we upload them to S3
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

module.exports = { upload };
