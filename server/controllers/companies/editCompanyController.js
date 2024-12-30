//server\controllers\companies\editCompanyController.js
const db = require("../../data/index.js");
const { Company } = db;
const ApiError = require("../../utils/apiError");

const editCompany = async (req, res, next) => {
  const company_id = req.params.id;
  const { name, registration_number, location, address, mol, email, phone, dds, status, logo_url, vat_number, iban } = req.body;

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
      dds,
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

module.exports = {
  editCompany
};
