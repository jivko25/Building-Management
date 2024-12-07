const db = require('../../data/index.js');
const { Measure } = db;
const ApiError = require('../../utils/apiError');

const getMeasureById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const measure = await Measure.findByPk(id);

        if (!measure) {
            throw new ApiError(404, 'Measure not found');
        }

        res.json({
            success: true,
            data: measure
        });
    } 
    catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server Error!'));
        }
    }
};

module.exports = {
    getMeasureById
};