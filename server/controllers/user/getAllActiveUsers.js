const pool = require("../../db");

const getAllActiveUsers = async (req, res) => {

    try {
        const query = 'SELECT * FROM tbl_users WHERE status = active';

        const [rows] = await pool.execute(query);

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal erver error!', error });
    }
};

module.exports = {
    getAllActiveUsers
};