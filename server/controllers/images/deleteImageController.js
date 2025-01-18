const s3Service = require("../../services/s3Service");
const db = require("../../data/index.js");
const { ProjectImage } = db;

const deleteImage = async (req, res) => {
    try {
      const imageId = req.params.image_id;
  
      // Намери записа в базата данни
      const imageRecord = await ProjectImage.findByPk(imageId);
      if (!imageRecord) {
        return res.status(404).json({
          message: "Image not found!"
        });
      }
  
      // Извличане на ключа (името на файла) от imageUrl
      const imageUrl = imageRecord.imageUrl;
      const bucketRegion = process.env.BUCKET_REGION;
      const bucketName = process.env.BUCKET_NAME;
      const s3Prefix = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/`;
  
      if (!imageUrl.startsWith(s3Prefix)) {
        return res.status(400).json({
          message: "Invalid S3 URL format!"
        });
      }
  
      const fileName = imageUrl.replace(s3Prefix, "");
  
      // Изтриване на файла от S3
      await s3Service.deleteImageAsync(fileName);
  
      // Изтриване на записа от базата данни
      await ProjectImage.destroy({
        where: { id: imageId }
      });
  
      res.status(200).json({
        message: "Image deleted successfully!"
      });
    } catch (error) {
      console.error("Error during image deletion:", error);
      res.status(500).json({
        message: "Image deletion failed!",
        error: error.message || error
      });
    }
  };  

module.exports = { deleteImage };
