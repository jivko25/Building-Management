const pool = require("../../db");

const getPaginatedActivities = async (req, res) => {
    const { _page = 1, _limit = 10, q = '' } = req.query;
    const searchTerm = q ? `%${q}%` : null;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);

    try {
        let totalQuery = 'SELECT COUNT(*) as total FROM tbl_activities';
        let totalQueryParams = [];

        if (q) {
            totalQuery += ' WHERE name LIKE ?';
            totalQueryParams.push(searchTerm);
        }

        const [[{ total }]] = await pool.query(totalQuery, totalQueryParams);

        let query = `
            SELECT id, name, status
            FROM tbl_activities
        `;

        let queryParams = [];

        if (q) {
            query += ' WHERE name LIKE ?';
            queryParams.push(searchTerm);
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(parseInt(_limit), offset);

        const [rows] = await pool.query(query, queryParams);

        res.json({
            data: rows,
            total,
            page: parseInt(_page),
            limit: parseInt(_limit),
            totalPages: Math.ceil(total / parseInt(_limit))
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error!',
            error: error.message
        });
    }
};

const getActivities = async (req, res) => {
    try {
        const query = 'SELECT * FROM tbl_activities';

        const [rows] = await pool.execute(query)

        res.json(rows)
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    };
};

module.exports = {
    getPaginatedActivities,
    getActivities
};