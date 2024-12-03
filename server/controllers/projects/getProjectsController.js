const pool = require("../../db");

const getProjects = async (req, res) => {

    try {
        let query = 'SELECT * FROM tbl_projects';

        const [rows] = await pool.query(query);

        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    getProjects
};