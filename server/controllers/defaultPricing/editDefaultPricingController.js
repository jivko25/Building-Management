const db = require("../../data/index.js");
const { DefaultPricing, Measure, Activity } = db;
const ApiError = require("../../utils/apiError");

const editDefaultPricing = async (req, res, next) => {
    try {
        const defaultPricingId = req.params.id;  

        const { price, activity_id, measure_id } = req.body;
        if (!price || !activity_id || !measure_id) {
            throw new ApiError(400, "Price, activity id and measure id are required!");
        }

        const isMeasure = await Measure.findByPk(measure_id, {
            attributes: {
                exclude: ["measure_id"]
            }
        });
        if (!isMeasure) {
            throw new ApiError(404, "Measure not found!");
        }

        const isActivity = await Activity.findByPk(activity_id, {
            attributes: {
                exclude: ["activity_id"]
            }
        });
        if (!isActivity) {
            throw new ApiError(404, "Activity not found!");
        }

        const defaultPricing = await DefaultPricing.findByPk(defaultPricingId);
        if (!defaultPricing) {
            throw new ApiError(404, "Default pricing not found!");
        }

        await defaultPricing.update({ price, activity_id, measure_id });
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