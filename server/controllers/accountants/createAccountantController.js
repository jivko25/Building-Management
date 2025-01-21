const db = require("../../data/index.js");
const { Accountant, Company, User } = db;
const ApiError = require("../../utils/apiError");

const createAccountant = async (req, res, next) => {
  const { name, note, number, email, company, accountantName, status } = req.body;

  try {
    // Намиране на всички необходими записи едновременно
    const [companyRecord, userRecord] = await Promise.all([
      Company.findOne({ where: { name: company } }), 
      User.findOne({ where: { full_name: accountantName } }), 
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

    // Създаване на новия счетоводител
    const newAccountant = await Accountant.create({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord.id,
      status
    });

    // Взимане на счетоводителя с всички връзки
    const accountantWithRelations = await Accountant.findByPk(newAccountant.id, {
      include: [
        { model: Company, as: "company", attributes: ["name"] },
        { model: User, as: "user", attributes: ["full_name"] }
      ]
    });

    res.status(201).json({
      message: "Accountant created successfully!",
      accountant: accountantWithRelations
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
  createAccountant
}; 
