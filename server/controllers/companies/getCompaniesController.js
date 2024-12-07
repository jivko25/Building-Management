const db = require('../../data/index.js');
const { Company, Sequelize } = db;
const ApiError = require('../../utils/apiError');
const { Op } = Sequelize;

const getPaginatedCompanies = async (req, res, next) => {
    try {
        const { _page = 1, _limit = 10, q = '' } = req.query;
        const offset = (parseInt(_page) - 1) * parseInt(_limit);

        const whereClause = q ? {
            name: {
                [Op.like]: `%${q}%`
            }
        } : {};

        const { count, rows } = await Company.findAndCountAll({
            where: whereClause,
            limit: parseInt(_limit),
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.json({
            companies: rows,
            companiesCount: count,
            page: parseInt(_page),
            limit: parseInt(_limit),
            totalPages: Math.ceil(count / parseInt(_limit))
        });
    } catch (error) {
        next(new ApiError(500, 'Internal server Error!'));
    }
};

module.exports = {
    getPaginatedCompanies
};