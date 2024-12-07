const db = require('../../data/index.js');
const { Company } = db;
const ApiError = require('../../utils/apiError');

const getCompanyById = async (req, res, next) => {
    try {
        const company = await Company.findByPk(req.params.id);

        if (!company) {
            throw new ApiError(404, 'Company not found!');
        }

        res.json(company);
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal server Error!'));
        }
    }
};

module.exports = {
    getCompanyById
};
