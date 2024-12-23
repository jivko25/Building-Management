const db = require("../../data/index.js");
const { DefaultPricing } = db;
const ApiError = require("../../utils/apiError");

const editDefaultPricing = async (req, res, next) => {
    try {
        const defaultPricingId = req.params.id;

        const defaultPricing = await DefaultPricing.findByPk(defaultPricingId);
        if (!defaultPricing) {
            throw new ApiError(404, "Default pricing not found!");
        }

        const { price } = req.body;
        if (!price) {
            throw new ApiError(400, "Price is required!");
        }

        await defaultPricing.update({ price });
        res.status(200).json({ message: "Default pricing updated successfully!", defaultPricing });
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, "Internal server error!"));
        }
    }
};

module.exports = {
    editDefaultPricing
};