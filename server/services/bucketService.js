import multer from "multer";

// Memmory storage, so we keep images in memory, before we upload them to S3
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
