const db = require('../../data/index.js');
const User = db.User;

const getUserById = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'full_name', 'username', 'role', 'status', 'manager_id']
        });//think about if the current user is admin, he can see all users, if not (so the current user is manager), he can see only his users, and if the current user is user, he can see only himself
        if(!user)
            return res.status(404).send('User not found.');
        res.json(user);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getUserById
}