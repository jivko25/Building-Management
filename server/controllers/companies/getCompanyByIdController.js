const pool = require("../../db");

const getCompanyById = async (req, res) => {

    try {
        const companyId = req.params.id;

        const [rows] = await pool.execute('SELECT * FROM tbl_companies WHERE id = ?', [companyId])

        if (rows.length === 0) {
            return res.status(404).send('Company not found!')
        }

        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    getCompanyById
};