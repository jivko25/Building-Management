const { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKeyId = process.env.S3_BUCKET_ACCESS_KEY;
const secretAccessKey = process.env.S3_BUCKET_SECRET_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});
/***
 * fileName is optional, if not provided, the file.originalname will be used
 * @param {File} file - The file to upload
 * @param {string} fileName - The name of the file to upload
 * @returns {Promise<{response: Object, imageUrl: string, httpStatusCode: number}>} - The response from the S3 upload, the image URL, and the HTTP status code
 */
const uploadImageAsync = async (file, fileName) => {
  //Consider maybe generating file names, they are unique and are used to get the image afterwards
  const params = {
    Bucket: bucketName,
    Key: fileName || file.originalname, // if fileName is provided, it will be used as the key, otherwise the file.originalname will be used
    Body: file.buffer,
    ContentType: file.mimetype
  };
  const command = new PutObjectCommand(params);

  const response = await s3Client.send(command);
  const { httpStatusCode } = response.$metadata;
  if (httpStatusCode !== 200) {
    throw new Error("Image upload failed!");
  }
  const imageUrl = constructImageUrl(fileName || file.originalname);
  return { response, imageUrl, httpStatusCode };
};

/**
 * Deletes an image from the S3 bucket
 * @param {string} fileName - The name of the file to delete
 * @returns {Promise<void>} - Resolves if deletion is successful
 */
const deleteImageAsync = async (fileName) => {
  if (!fileName) {
    throw new Error("File name is required to delete the image!");
  }

  const params = {
    Bucket: bucketName,
    Key: fileName
  };

  const command = new DeleteObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    console.log(`Successfully deleted ${fileName} from bucket ${bucketName}`);
    return response;
  } catch (error) {
    console.error(`Failed to delete ${fileName} from bucket ${bucketName}:`, error);
    throw error;
  }
};

module.exports = { uploadImageAsync, deleteImageAsync };

/**
 * Constructs the image URL
 * @param {string} fileName - The name of the file to upload
 * @returns {string} - The image URL
 */
function constructImageUrl(fileName) {
  return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${fileName}`;
}
