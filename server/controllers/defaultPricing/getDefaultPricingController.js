const db = require("../../data/index.js");
const { DefaultPricing } = db;

const getDefaultPricing = async (req, res, next) => {
    const artisanId = req.params.id;
    const defaultPricing = await DefaultPricing.findAll({
        where: {
            artisan_id: artisanId
        }
    });
    if (defaultPricing.length === 0) {
        return res.json([]);
    }
    res.status(200).json({
        message: "Default pricing fetched successfully!",
        defaultPricing
    });

};

module.exports = {
    getDefaultPricing
};