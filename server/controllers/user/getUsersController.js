const db = require('../../data/index.js');
const User = db.User;
const { Op } = db.Sequelize;

const getUsers = async (req, res) => {
    const { _page = 1, _limit = 10, q = '' } = req.query;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);
    const searchTerm = q ? `%${q}%` : null;
    const currentUserId = req.user.id;

    try {
        const whereClause = buildWhereClause(req.user.role, currentUserId, searchTerm);

        const { count: usersCount, rows: users } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['hashedPassword'] },
            limit: parseInt(_limit),
            offset: offset,
            order: [
                ['status', 'ASC'],
                ['username', 'ASC']
            ]
        });

        res.status(200).json({
            users,
            usersCount,
            page: parseInt(_page),
            limit: parseInt(_limit),
            totalPages: Math.ceil(usersCount / parseInt(_limit))
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

function buildWhereClause(role, currentUserId, searchTerm) {
    const whereClause = {};

    if (role === 'manager') {
        whereClause.manager_id = currentUserId;
        if (searchTerm) {
            whereClause[Op.or] = [
                { full_name: { [Op.like]: searchTerm } },
                { username: { [Op.like]: searchTerm } }
            ];
        }
    } else if (role === 'admin' && searchTerm) {
        whereClause[Op.or] = [
            { full_name: { [Op.like]: searchTerm } },
            { username: { [Op.like]: searchTerm } }
        ];
    }

    return whereClause;
}

module.exports = {
    getUsers,
};