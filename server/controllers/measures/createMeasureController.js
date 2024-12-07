const db = require('../../data/index.js');
const { Measure } = db;
const ApiError = require('../../utils/apiError');

const createMeasure = async (req, res, next) => {
    try {
        const { name } = req.body;

        const existingMeasure = await Measure.findOne({
            where: { name }
        });

        if (existingMeasure) {
            throw new ApiError(400, `Measure with name "${name}" already exists`);
        }

        const newMeasure = await Measure.create({ name });

        res.status(201).json({
            success: true,
            message: 'Measure created successfully!',
            data: newMeasure
        });

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server Error!'));
        }
    }
};

module.exports = {
    createMeasure
};