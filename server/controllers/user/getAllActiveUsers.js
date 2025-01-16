//server\controllers\user\getAllActiveUsers.js
const db = require("../../data/index.js");
const User = db.User;

const getAllActiveUsers = async (req, res, next) => {
    const users = await User.findAll({
        where: {
            status: "active"
        },
        attributes: ["id", "full_name", "username", "role", "status", "manager_id"]
    });

    res.json(users);
};

module.exports = {
    getAllActiveUsers
};
