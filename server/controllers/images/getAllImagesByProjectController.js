const db = require("../../data/index.js");
const { ProjectImage } = db;

const getAllImagesByProject = async (req, res) => {
  try {
    const projectId = req.params.project_id;

    const images = await ProjectImage.findAll({
      where: { projectId: projectId }
    });

    res.status(200).json({
      message: "Images retrieved successfully!",
      images: images
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve images!",
      error: error
    });
  }
};

module.exports = { getAllImagesByProject };