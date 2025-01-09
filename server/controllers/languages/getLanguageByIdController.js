const db = require("../../data/index.js");
const { InvoiceLanguage } = db;
const ApiError = require("../../utils/apiError");

const getLanguageById = async (req, res, next) => {
  console.log("Fetching language by ID:", req.params.id);
  try {
    const language = await InvoiceLanguage.findByPk(req.params.id);

    if (!language) {
      throw new ApiError(404, "Language not found!");
    }

    console.log("Language found:", language.id);
    res.json(language);
  } catch (error) {
    console.error("Error fetching language:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getLanguageById
};
