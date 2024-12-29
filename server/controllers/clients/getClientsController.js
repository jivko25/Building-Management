const db = require("../../data/index.js");
const { Client, User } = db;

const getClients = async (req, res, next) => {
  console.log("Fetching all clients...");
  console.log("User role:", req.user.role);
  console.log("User ID:", req.user.id);

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

    console.log("Number of clients found:", clients.length);
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    next(error);
  }
};

module.exports = {
  getClients
};
