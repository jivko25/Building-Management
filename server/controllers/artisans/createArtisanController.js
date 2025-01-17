//server\controllers\artisans\createArtisanController.js
const db = require("../../data/index.js");
const { Artisan, Company, User, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const createArtisan = async (req, res, next) => {
  console.log("Creating new artisan with data:", req.body);
  const { name, note, number, email, company, artisanName, status, activity, measure } = req.body;

  try {
    // Проверка за съществуващ артисан
    const existingArtisan = await Artisan.findOne({ where: { name } });
    if (existingArtisan) {
      console.log("Artisan already exists:", name);
      throw new ApiError(400, `${name} already exists!`);
    }

    // Намиране на всички необходими записи едновременно
    const [companyRecord, userRecord] = await Promise.all([Company.findOne({ where: { name: company } }), User.findOne({ where: { full_name: artisanName } })]);

    // Проверка за съществуване на записите
    if (!companyRecord) {
      console.log("Company not found:", company);
      throw new ApiError(404, "Company not found!");
    }
    if (!userRecord) {
      console.log("User not found:", artisanName);
      throw new ApiError(404, "User not found!");
    }

    // Създаване на новия артисан
    const newArtisan = await Artisan.create({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord.id,
      status,
      creator_id: req.user.id
    });

    // Взимане на артисана с всички връзки
    const artisanWithRelations = await Artisan.findByPk(newArtisan.id, {
      include: [
        { model: Company, as: "company", attributes: ["name"] },
        { model: User, as: "user", attributes: ["full_name"] },
        { model: Activity, as: "activity", attributes: ["name"] },
        { model: Measure, as: "measure", attributes: ["name"] }
      ]
    });

    console.log("Artisan created successfully:", newArtisan.id);

    res.status(201).json({
      message: "Artisan created successfully!",
      artisan: artisanWithRelations
    });
  } catch (error) {
    console.error("Error in createArtisan:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, error.message));
    }
  }
};

module.exports = {
  createArtisan
};
