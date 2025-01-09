const db = require("../../data/index.js");
const { InvoiceLanguage } = db;
const ApiError = require("../../utils/apiError");

const getLanguages = async (req, res, next) => {
  console.log("Fetching all languages...");
  try {
    const languages = await InvoiceLanguage.findAll({
      order: [["id", "ASC"]]
    });

    console.log("Number of languages found:", languages.length);
    res.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    next(new ApiError(500, "Internal server Error!"));
  }
};

module.exports = {
  getLanguages
};
