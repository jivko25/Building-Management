const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../data/index.js');
const User = db.User;
const { generateTokenSetCookie } = require('../../utils/generateTokenCookieSetter');

// Login function
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Retrieve user from the database using Sequelize
        const user = await User.findOne({
            where: {
                username: username,
                status: 'active'
            }
        });

        // Check if user exists
        if (!user) {
            console.log('No user found with the provided username');
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!isPasswordCorrect) {
            console.log('Password does not match for the provided username');
            return res.status(401).json({
                error: 'Invalid username or password'
            });
        }

        generateTokenSetCookie(res, user);

        res.status(201).json({
            success: 'true',
            message: 'Login successful',
            user: {
                username: user.username,
                full_name: user.full_name,
                role: user.role,
                status: user.status,
            }
        });
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
    });
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
};

module.exports = {
    login,
    logout,
};