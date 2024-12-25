const db = require("../../data/index.js");
const { DefaultPricing } = db;
const ApiError = require("../../utils/apiError");

const getDefaultPricingById = async (req, res, next) => {
    try {
        const defaultPricingId = req.params.id;
        const defaultPricing = await DefaultPricing.findByPk(defaultPricingId);     
        if (!defaultPricing) {
            throw new ApiError(404, "Default pricing not found!");
        }
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
    getDefaultPricingById
};