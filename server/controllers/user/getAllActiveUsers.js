const db = require('../../data/index.js');
const User = db.User;

const getAllActiveUsers = async (req, res) => {
    try{
        const users = await User.findAll({
            where: {
                status: 'active'
            }, 
            attributes: ['id', 'full_name', 'username', 'role', 'status', 'manager_id']
        });

        res.json(users);
    } catch(error){
        res.status(500).json({ message: 'Internal server error!', error });
    }
};

module.exports = {
    getAllActiveUsers
};