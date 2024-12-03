const hashPassword = require('../../utils/hashPassword');
const pool = require("../../db")
const { uniqueChecker } = require('../../utils/uniqueChecker');

const createUser = async (req, res) => {
    const { name_and_family, username, password, status, role } = req.body;
    const loggedUserId = req.user.id;

    try {
        const isUnique = await uniqueChecker("username", username, "tbl_users");

        if (isUnique.length > 0) {
            return res.status(404).send(`${name} already exists!`)
        };

        const hashedPassword = await hashPassword(password);

        const query = `
        INSERT INTO tbl_users (name_and_family, username, password, role, status, manager)
        VALUES (?, ?, ?, ?, ?, ?);
        `;

        const values = [name_and_family, username, hashedPassword, role, status, loggedUserId];

        const [result] = await pool.query(query, values);

        const newUser = {
            id: result.insertId,
            name_and_family,
            username,
            password,
            role,
            status,
            manager_id: loggedUserId
        };

        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};


module.exports = {
    createUser
};