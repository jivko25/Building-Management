const uploadImage = async (req, res) => {
  console.log("from body", req.body);
  console.log("from multer", req.file);
  res.status(200).json({
    message: "Image uploaded successfully!",
    image: req.file
  });
};
module.exports = { uploadImage };
