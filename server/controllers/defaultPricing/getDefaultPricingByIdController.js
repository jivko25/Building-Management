const db = require("../../data/index.js");
const { DefaultPricing } = db;

const getDefaultPricingById = async (req, res, next) => {
    const defaultPricingId = req.params.id;
    const defaultPricing = await DefaultPricing.findByPk(defaultPricingId);
    if (!defaultPricing) {
        return res.json([]);
    }
    res.status(200).json({
        message: "Default pricing fetched successfully!",
        defaultPricing
    });
};

module.exports = {
    getDefaultPricingById
};