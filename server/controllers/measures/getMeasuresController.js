const pool = require("../../db");

const getMeasures = async (req, res) => {

    try {
        const query = 'SELECT * FROM tbl_measures';

        const [rows] = await pool.execute(query)

        res.json(rows)
    } 
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    };
};

module.exports = {
    getMeasures,
};