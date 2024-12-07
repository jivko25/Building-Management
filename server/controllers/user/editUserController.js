const db = require('../../data/index.js');
const User = db.User;
const { Op } = db.Sequelize;
const hashPassword = require("../../utils/hashPassword");
const ApiError = require('../../utils/apiError');

const editUser = async (req, res, next) => {
    const userId = req.params.id;
    const { full_name, username, password, role, status } = req.body;
    const currentUserRole = req.user.role;

    try {
        const user = await User.findByPk(userId);

        if(currentUserRole === 'user' || (currentUserRole === 'manager' && user.manager_id !== req.user.id )){
            throw new ApiError(403, 'You are not authorized to edit this user.');
        }

        if (!user) {
            throw new ApiError(404, 'User not found.');
        }

        if (full_name) {
            if (full_name.trim() === '') {
                throw new ApiError(400, 'Full name cannot be empty.');
            }
            user.full_name = full_name;
        }

        if (username) {
            if (username.trim() === '') {
                throw new ApiError(400, 'Username cannot be empty.');
            }
            const existingUser = await User.findOne({ where: { username, id: { [Op.ne]: userId } } });
            if (existingUser) {
                throw new ApiError(400, 'Username is already taken.');
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
                throw new ApiError(400, 'You cannot change the role of this user.');
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
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Internal Server Error', err));
        }
    }
}

module.exports = {
    editUser
};