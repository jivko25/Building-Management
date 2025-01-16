const db = require("../../data/index.js");
const { Client, User } = db;

const getClients = async (req, res, next) => {
  try {
    let clients;

    if (req.user.role === "admin") {
      clients = await Client.findAll({
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["username"]
          }
        ],
        order: [["id", "DESC"]]
      });
    } else {
      clients = await Client.findAll({
        where: {
          creator_id: req.user.id
        },
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["username"]
          }
        ],
        order: [["id", "DESC"]]
      });
    }

    res.json(clients);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients
};
