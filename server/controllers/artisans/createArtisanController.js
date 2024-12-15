//server\controllers\artisans\createArtisanController.js
const db = require("../../data/index.js");
const { Artisan, Company, User } = db;
const ApiError = require("../../utils/apiError");

const createArtisan = async (req, res, next) => {
  const { name, note, number, email, company, artisanName, status } = req.body;

  try {
    const existingArtisan = await Artisan.findOne({ where: { name } });
    if (existingArtisan) {
      throw new ApiError(400, `${name} already exists!`);
    }

    const [companyRecord, userRecord] = await Promise.all([Company.findOne({ where: { name: company } }), User.findOne({ where: { full_name: artisanName } })]);

    if (!companyRecord) throw new ApiError(404, "Company not found!");
    if (!userRecord) throw new ApiError(404, "User not found!");

    const newArtisan = await Artisan.create({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord.id,
      status
    });

    res.status(201).json({
      message: "Artisan created successfully!",
      artisan: newArtisan
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      console.log(error);
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  createArtisan
};
