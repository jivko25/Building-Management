const db = require("../../data/index.js");
const { Accountant, Company, User } = db;
const ApiError = require("../../utils/apiError");

const editAccountant = async (req, res, next) => {
  const accountantId = req.params.id;
  const { name, note, number, email, company, accountantName, status } = req.body;

  try {
    const accountant = await Accountant.findByPk(accountantId);
    if (!accountant) {
      throw new ApiError(404, "Accountant not found!");
    }

    const [companyRecord, userRecord] = await Promise.all([
      Company.findOne({ where: { name: company } }), 
      User.findOne({ where: { full_name: accountantName } })
    ]);

    if (!companyRecord) throw new ApiError(404, "Company not found!");
    if (!userRecord) throw new ApiError(404, "User not found!");

    const updatedAccountant = await accountant.update({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord.id,
      status
    });

    res.json({
      message: "Accountant updated successfully!",
      accountant: updatedAccountant
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
  editAccountant
}; 
