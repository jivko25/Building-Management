const db = require('../../data/index.js');
const User = db.User;
const { Op } = db.Sequelize;
const hashPassword = require("../../utils/hashPassword");

const editUser = async (req, res) => {
    const userId = req.params.id;
    const { full_name, username, password, role, status } = req.body;
    const currentUserRole = req.user.role;

    try {
        const user = await User.findByPk(userId);

        if(currentUserRole === 'user' || (currentUserRole === 'manager' && user.manager_id !== req.user.id )){
            return res.status(403).send('You are not authorized to edit this user.');
        }

        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (full_name) {
            if (full_name.trim() === '') {
                return res.status(400).send('Full name cannot be empty.');
            }
            user.full_name = full_name;
        }

        if (username) {
            if (username.trim() === '') {
                return res.status(400).send('Username cannot be empty.');
            }
            const existingUser = await User.findOne({ where: { username, id: { [Op.ne]: userId } } });
            if (existingUser) {
                return res.status(400).send('Username is already taken.');
            }
            user.username = username;
        }

        if (password) {
            if (password.trim() !== '') {
                user.hashedPassword = await hashPassword(password);
            }
        }

        if (role) {
            if((currentUserRole === 'admin' && user.role === 'admin') && (role === 'manager' || role === 'user')){
                return res.status(400).send('You cannot change the role of this user.');
            } else if (currentUserRole === "manager" && role === "user") {
                user.role = role;
            }
        }

        if (status) {
            if (status === "active" || status === "inactive") {
                user.status = status;
            }
        }

        await user.save();
        res.status(200).send('User updated successfully');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    editUser
};