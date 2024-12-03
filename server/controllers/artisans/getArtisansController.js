const pool = require("../../db");
const { getControllerNameById } = require('../../utils/getControllerNameById');

const getPaginatedArtisans = async (req, res) => {
    const { _page = 1, _limit = 10, q = '' } = req.query;
    const searchTerm = q ? `%${q}%` : null;
    const offset = (parseInt(_page) - 1) * parseInt(_limit);

    try {
        let totalQuery = `SELECT COUNT(*) as total FROM tbl_artisans`;
        const totalQueryParams = [];

        if (q) {
            totalQuery += ' WHERE name LIKE ?';
            totalQueryParams.push(searchTerm);
        }

        const [[{ total }]] = await pool.query(totalQuery, totalQueryParams);

        let query = `
            SELECT * 
            FROM tbl_artisans
        `;

        const queryParams = [];

        if (q) {
            query += ' WHERE name LIKE ?';
            queryParams.push(searchTerm);
        }

        query += ' LIMIT ? OFFSET ?';
        queryParams.push(parseInt(_limit), offset);

        const [rows] = await pool.query(query, queryParams);

        const artisansCompanyNames = await Promise.all(
            rows.map(async (artisan) => {
                try {
                    const companyName = await getControllerNameById(artisan.company_id, "tbl_companies", "name");
                    const userName = await getControllerNameById(artisan.user_id, "tbl_users", "name_and_family");

                    return {
                        ...artisan,
                        company: companyName || null,
                        artisanName: userName || null,
                    };
                } catch (error) {
                    console.log('Error fetching artisan data', error);
                    return {
                        ...artisan,
                        company: null,
                        artisanName: null,
                    }
                }
            })
        );

        res.status(200).json({
            data: artisansCompanyNames,
            page: parseInt(_page),
            limit: parseInt(_limit),
            total,
            totalPages: Math.ceil(total / parseInt(_limit))
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

const getArtisans = async (req, res) => {
    try {
        const query = `SELECT * FROM tbl_artisans`;

        const [rows] = await pool.query(query);

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = {
    getPaginatedArtisans,
    getArtisans
};