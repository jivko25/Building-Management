const s3Service = require("../../services/s3Service");
const uploadImage = async (req, res) => {
  try {
    const { response, imageUrl } = await s3Service.uploadImageAsync(req.file);
    res.status(200).json({
      message: "Image uploaded successfully!",
      image: imageUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Image upload failed!",
      error: error
    });
  }
};

module.exports = { uploadImage };
