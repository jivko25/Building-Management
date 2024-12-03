const db = require("../db");

async function uniqueChecker(prop, value, table) {

    try {
        const [rows] = await db.execute(`SELECT * FROM ${table} WHERE ${prop} = ?`, [value]);

        return (rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error!' });
    }
};

module.exports = {
    uniqueChecker
};