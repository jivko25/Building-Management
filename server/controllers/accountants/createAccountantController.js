const db = require("../../data/index.js");
const { Accountant, Company, User, Measure } = db;
const ApiError = require("../../utils/apiError");

const createAccountant = async (req, res, next) => {
  console.log("Creating new accountant with data:", req.body);
  const { name, note, number, email, company, accountantName, status, measure } = req.body;

  try {
    // Проверка за съществуващ счетоводител
    const existingAccountant = await Accountant.findOne({ where: { name } });
    if (existingAccountant) {
      console.log("Accountant already exists:", name);
      throw new ApiError(400, `${name} already exists!`);
    }

    // Намиране на всички необходими записи едновременно
    const [companyRecord, userRecord, measureRecord] = await Promise.all([
      Company.findOne({ where: { name: company } }),
      User.findOne({ where: { full_name: accountantName } }),
      Measure.findOne({ where: { name: measure } })
    ]);


    // Проверка за съществуване на записите
    if (!companyRecord) {
      console.log("Company not found:", company);
      throw new ApiError(404, "Company not found!");
    }
    if (!userRecord) {
      console.log("User not found:", accountantName);
      throw new ApiError(404, "User not found!");
    }
    if (!measureRecord) {
      console.log("Measure not found:", measure);
      throw new ApiError(404, "Measure not found!");
    }

    // Създаване на новия счетоводител
    const newAccountant = await Accountant.create({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord.id,
      status,
      measure_id: measureRecord.id
    });

    // Взимане на счетоводителя с всички връзки
    const accountantWithRelations = await Accountant.findByPk(newAccountant.id, {
      include: [
        { model: Company, as: "company", attributes: ["name"] },
        { model: User, as: "user", attributes: ["full_name"] },
        { model: Measure, as: "measure", attributes: ["name"] }
      ]
    });

    console.log("Accountant created successfully:", newAccountant.id);

    res.status(201).json({
      message: "Accountant created successfully!",
      accountant: accountantWithRelations
    });
  } catch (error) {
    console.error("Error in createAccountant:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  createAccountant
}; 
