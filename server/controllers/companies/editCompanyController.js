//server\controllers\companies\editCompanyController.js
const db = require("../../data/index.js");
const s3Service = require("../../services/s3Service");
const { Company } = db;
const ApiError = require("../../utils/apiError");
const { Op } = require("sequelize");

const editCompany = async (req, res, next) => {
  const company_id = req.params.id;
  const { name, registration_number, location, address, mol, email, phone, status, logo_url, vat_number, iban } = req.body;

  try {
    const company = await Company.findByPk(company_id);

    if (!company) {
      throw new ApiError(404, "Company not found!");
    }

    if (company.name !== name) {
      const existingCompany = await Company.findOne({ where: { name } });
      if (existingCompany) {
        throw new ApiError(400, `${name} already exists!`);
      }
    }

    const updatedCompany = await company.update({
      name,
      registration_number,
      location,
      address,
      mol,
      email,
      phone,
      status,
      logo_url,
      vat_number,
      iban
    });

    res.json({
      message: "Company updated successfully!",
      company: updatedCompany
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

const uploadCompanyLogo = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { response, imageUrl } = await s3Service.uploadImageAsync(req.file, req.file.name);

    const company = await Company.findByPk(companyId);

    await company.update(
      { logo_url: imageUrl },
      { where: { id: companyId } }
    );

    res.status(200).json({
      message: "Image uploaded and record created successfully!",
      image: imageUrl,
      companyId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Image upload or record creation failed!",
      error: error
    });
  }
};

const deleteCompanyLogo = async (req, res, next) => {
  try {
    const companyId = req.params.id; // Променено от image_id на id
    
    // Намираме компанията по ID
    const company = await Company.findByPk(companyId);
    if (!company || !company.logo_url) {
      return res.status(404).json({
        message: "Company or logo not found!"
      });
    }

    // Извличане на ключа (името на файла) от logo_url
    const bucketRegion = process.env.BUCKET_REGION;
    const bucketName = process.env.BUCKET_NAME;
    const s3Prefix = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/`;

    if (!company.logo_url.startsWith(s3Prefix)) {
      return res.status(400).json({
        message: `Invalid S3 URL format!`
      });
    }

    const fileName = company.logo_url.replace(s3Prefix, "");

    // Изтриване на файла от S3
    await s3Service.deleteImageAsync(fileName);

    // Изтриване на референцията към логото в базата данни
    await company.update({ logo_url: null });

    res.status(200).json({
      message: "Logo deleted successfully!"
    });
  } catch (error) {
    console.error("Error during logo deletion:", error);
    res.status(500).json({
      message: "Logo deletion failed!",
      error: error.message || error
    });
    next(error);
  }
};

module.exports = {
  editCompany,
  uploadCompanyLogo,
  deleteCompanyLogo
};
