const db = require("../../data/index.js");
const { DefaultPricing, Artisan, Activity, Measure } = db;
const ApiError = require("../../utils/apiError");

const createDefaultPricing = async (req, res, next) => {
    try {
        const artisan_id = req.params.id;

        const isArtisan = await Artisan.findOne({
            where: {
                id: artisan_id
            },
            attributes: {
                exclude: ["artisan_id"]
            }
        });
        if (!isArtisan) {
            throw new ApiError(404, "Artisan not found!");
        }

        const { activity_id, measure_id, price } = req.body;

        if (!activity_id || !measure_id || !price || !artisan_id) {
            throw new ApiError(400, "Activity id, measure id, price and artisan id are required!");
        }

        const isActivity = await Activity.findOne({
            where: {
                id: activity_id
            },
            attributes: {
                exclude: ["activity_id"]
            }
        });
        if (!isActivity) {
            throw new ApiError(404, "Activity not found!");
        }

        const isMeasure = await Measure.findOne({
            where: {
                id: measure_id
            },
            attributes: {
                exclude: ["measure_id"]
            }
        });
        if (!isMeasure) {
            throw new ApiError(404, "Measure not found!");
        }

        const isDefaultPricing = await DefaultPricing.findOne({
            where: {
                artisan_id: artisan_id,
                activity_id: activity_id,
                measure_id: measure_id
            }
        });
        if (isDefaultPricing) {
            throw new ApiError(400, "Default pricing already exists!");
        }

        const defaultPricing = await DefaultPricing.create({
            activity_id,
            measure_id,
            artisan_id: artisan_id,
            price
        }); 

        res.status(201).json({
            message: "Default pricing created successfully!",
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
    createDefaultPricing
};