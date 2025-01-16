const db = require("../../data/index.js");
const { Client, User } = db;

const getClientById = async (req, res, next) => {
    const client = await Client.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: "creator",
                attributes: ["username"]
            }
        ]
    });

    if (!client) {
        return res.json([]);
    }

    res.json(client);
};

module.exports = {
    getClientById
};
