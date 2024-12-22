const s3Service = require("../../services/s3Service");
const db = require("../../data/index.js");
const { ProjectImage } = db;

const uploadImage = async (req, res) => {
  try {
    const projectId = req.params.project_id;
    const { response, imageUrl } = await s3Service.uploadImageAsync(req.file, req.file.name);

    await ProjectImage.create({
      projectId: projectId,
      imageUrl: imageUrl
    });

    res.status(200).json({
      message: "Image uploaded and record created successfully!",
      image: imageUrl,
      projectId: projectId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Image upload or record creation failed!",
      error: error
    });
  }
};

module.exports = { uploadImage };