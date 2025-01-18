const db = require("../../data/index.js");
const { DefaultPricing } = db;

const getDefaultPricing = async (req, res, next) => {
  try {
    const artisanId = req.params.id;
    const defaultPricing = await DefaultPricing.findAll({
      where: {
        artisan_id: artisanId
      }
    });
     res.status(200).json({
      message: "Default pricing fetched successfully!",
      defaultPricing
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
  getDefaultPricing
};
