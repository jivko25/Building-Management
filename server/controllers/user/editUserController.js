const pool = require("../../db")
const hashPassword = require("../../utils/hashPassword");

const editUser = async (req, res) => {

    const userId = req.params.id;
    const { name_and_family, username, password, role, status } = req.body;
    const currentUserRole = req.user.role;

    let query = 'UPDATE tbl_users SET ';
    const queryParams = [];
    try {
        if (name_and_family) {
            if (name_and_family.trim() === '') {
                return res.status(400).send('Name and Family cannot be empty.')
            }
            query += 'name_and_family = ?, ';
            queryParams.push(name_and_family);
        }

        if (username) {
            if (username.trim() === '') {
                return res.status(400).send('Username cannot be empty.')
            }
            const [rows] = await pool.execute('SELECT id FROM tbl_users WHERE username = ? AND id != ?', [username, userId])
            if (rows.length > 0) {
                return res.status(400).send('Username is already taken.')
            }

            query += 'username = ?, ';
            queryParams.push(username);
        }

        if (password) {
            if (password.trim() !== '') {
                const hashedPassword = await hashPassword(password);
                query += 'password = ?, ';
                queryParams.push(hashedPassword);
            }
        }
        if (role) {
            if (currentUserRole === "admin" && (role === "manager" || role === "user")) {
                query += 'role = ?, ';
                queryParams.push(role);
            } else if (currentUserRole === "manager" && role === "user") {
                query += 'role = ?, ';
                queryParams.push(role);
            }
        }
        if (status) {
            if (status === "active" || status === "inactive") {
                query += 'status = ?, ';
                queryParams.push(status);
            }
        }

        query = query.slice(0, -2);
        query += ' WHERE id = ?'
        queryParams.push(userId)

        try {
            const [result] = await pool.execute(query, queryParams)
            res.status(200).send('User updated successfully')
        } catch (error) {
            res.status(500).send(error);
        }

    } catch (err) {
        res.status(500).send('Internal Server Error');
    }

}

module.exports = {
    editUser
};