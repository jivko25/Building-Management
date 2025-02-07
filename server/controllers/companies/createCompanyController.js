//server\controllers\companies\createCompanyController.js
const db = require("../../data/index.js");
const { Company } = db;
const ApiError = require("../../utils/apiError");

const createCompany = async (req, res, next) => {
  const { name, registration_number, location, address, mol, email, phone, dds, status, logo_url, vat_number, iban } = req.body;

  try {
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      throw new ApiError(400, `${name} already exists!`);
    }

    const newCompany = await Company.create({
      name,
      registration_number,
      location,
      address,
      mol,
      email,
      phone,
      dds,
      status,
      logo_url,
      vat_number,
      iban,
      creator_id: req.user.id
    });

    res.status(201).json({
      message: "Company created successfully!",
      company: newCompany
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  createCompany
};
