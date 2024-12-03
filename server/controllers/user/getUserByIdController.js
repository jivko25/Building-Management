const pool = require("../../db")

const getUserById = async (req, res) => {

    try {
        const userId = req.params.id;

        const [rows] = await pool.execute('SELECT id, name_and_family, username, role, status, manager FROM tbl_users WHERE id = ?', [userId])

        if (rows.length === 0) {
            return res.status(404).send('User not found.')
        }

        res.json(rows[0]);

    } catch (error) {
        console.error('Database error:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = getUserById;