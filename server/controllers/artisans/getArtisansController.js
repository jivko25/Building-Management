const db = require('../../data/index.js');
const { Artisan, Company, User, Sequelize } = db;
const ApiError = require('../../utils/apiError');
const { Op } = Sequelize;

const getPaginatedArtisans = async (req, res, next) => {
    try {
        const { _page = 1, _limit = 10, q = '' } = req.query;
        const offset = (parseInt(_page) - 1) * parseInt(_limit);

        const whereClause = q ? {
            name: {
                [Op.like]: `%${q}%`
            }
        } : {};

        const { count, rows } = await Artisan.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['full_name']
                }
            ],
            limit: parseInt(_limit),
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.json({
            artisans: rows,
            artisansCount: count,
            page: parseInt(_page),
            limit: parseInt(_limit),
            totalPages: Math.ceil(count / parseInt(_limit))
        });
    } catch (error) {
        console.log(error);
        next(new ApiError(500, 'Internal server Error!'));
    }
};

const getArtisans = async (req, res, next) => {
    try {
        const artisans = await Artisan.findAll({
            include: [{
                model: Company,
                as: 'company',
                attributes: ['name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['full_name']
            },
            ],
            order: [['id', 'DESC']]
        });

        res.json(artisans);
    } catch (error) {
        console.log(error);
        next(new ApiError(500, 'Internal server Error!'));
    }
};

module.exports = {
    getPaginatedArtisans,
    getArtisans
};
