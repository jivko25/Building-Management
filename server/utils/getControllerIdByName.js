const pool = require("../db");

const getControllerIdByName = async (name, table) => {
    try {
        let query;

        if (table === "tbl_users") {
            query = `SELECT id FROM ${table} WHERE name_and_family = ?`;
        }
        else {
            query= `SELECT id FROM ${table} WHERE name = ?`;

        }
        const [rows] = await pool.query(query, [name]);

        if (rows.length > 0) {
            return rows[0].id;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal server Error!');
    }
};

module.exports = {
    getControllerIdByName
};
