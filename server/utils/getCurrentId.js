const pool = require("../db");

async function getCurrentId(table, id){

    try {
        const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE id = ?`, [id])

        return rows[0];
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
    }
};

module.exports = {
    getCurrentId
};