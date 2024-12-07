const hashPassword = require('../../utils/hashPassword');
const db = require('../../data/index.js');
const User = db.User;
const ApiError = require('../../utils/apiError');

const createUser = async (req, res, next) => {
    const { full_name, username, password, status, role } = req.body;
    const loggedUserId = req.user.id;

    try {
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            throw new ApiError(404, `${username} already exists!`);
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            full_name,
            username,
            hashedPassword,
            role,
            status,
            manager_id: loggedUserId
        });

        const userResponse = {
            id: newUser.id,
            full_name: newUser.full_name,
            username: newUser.username,
            role: newUser.role,
            status: newUser.status,
            manager_id: newUser.manager_id
        };

        res.status(201).json({ message: 'User created successfully', user: userResponse });

    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(500, 'Error creating user', error));
        }
    }
};

module.exports = {
    createUser
};