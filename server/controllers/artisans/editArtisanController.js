//server\controllers\artisans\editArtisanController.js
const db = require("../../data/index.js");
const { Artisan, Company, User, Task } = db;
const ApiError = require("../../utils/apiError");

const editArtisan = async (req, res, next) => {
  const artisanId = req.params.id;
  const { name, note, number, email, company, artisanName, status, activity_id, measure_id } = req.body;

  try {
    const artisan = await Artisan.findByPk(artisanId);
    if (!artisan) {
      throw new ApiError(404, "Artisan not found!");
    }

    const [companyRecord, userRecord] = await Promise.all([Company.findOne({ where: { name: company } }), User.findOne({ where: { full_name: artisanName || '' } })]);

    if (!companyRecord) throw new ApiError(404, "Company not found!");
    if (artisanName && !userRecord) throw new ApiError(404, "User not found!");


    const updatedArtisan = await artisan.update({
      name,
      note,
      number,
      email,
      company_id: companyRecord.id,
      user_id: userRecord?.id,
      status,
      activity_id,
      measure_id
    });

    res.json({
      message: "Artisan updated successfully!",
      artisan: updatedArtisan
    });
  } catch (error) {
    console.log(error, 'error');
    
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  editArtisan
};
