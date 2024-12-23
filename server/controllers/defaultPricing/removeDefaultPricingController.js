const db = require("../../data/index.js");
const { DefaultPricing } = db;  
const ApiError = require("../../utils/apiError");

const removeDefaultPricing = async (req, res, next) => {
    try {
        const defaultPricingId = req.params.id;
        const defaultPricing = await DefaultPricing.findByPk(defaultPricingId);
        if (!defaultPricing) {
            throw new ApiError(404, "Default pricing not found!");
        }
        await defaultPricing.destroy();
        res.status(200).json({ message: "Default pricing removed successfully!" });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Internal server error!"));
        }
    }
};

module.exports = {
    removeDefaultPricing
};