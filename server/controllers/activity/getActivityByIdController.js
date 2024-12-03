const pool = require("../../db");

const getActivityById = async (req, res) => {
    const activityId = req.params.id;

    try {
        const query = `
            SELECT id, name, status 
            FROM tbl_activities 
            WHERE id = ?
        `;

        const [rows] = await pool.execute(query, [activityId]);

        if (rows.length === 0) {
            return res.status(404).send('Activity not found!');
        }

        res.json(rows[0]);

    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
    }
};

module.exports = {
    getActivityById
};