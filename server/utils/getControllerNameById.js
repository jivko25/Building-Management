/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const pool = require("../db");

const getControllerNameById = async (id, table, columnName) => {
    try {
        const query = `SELECT ${columnName} FROM ${table} WHERE id = ?`;
        const [rows] = await pool.query(query, [id]);

        if (rows.length > 0) {
            return rows[0][columnName];
        } else {
            return null;
        }
    } catch (error) {
        throw new Error('Internal server Error!');
    }
};

module.exports = {
    getControllerNameById
};