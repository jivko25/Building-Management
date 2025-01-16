const db = require("../../data/index.js");
const { Client, User, InvoiceLanguage } = db;

const getClients = async (req, res, next) => {
  try {
    let clients;
    const includeOptions = [
      {
        model: User,
        as: "creator",
        attributes: ["username"]
      },
      {
        model: InvoiceLanguage,
        as: "invoiceLanguage",
        attributes: ["code", "name"]
      }
    ];

    if (req.user.role === "admin") {
      clients = await Client.findAll({
        include: includeOptions,
        order: [["id", "DESC"]]
      });
    } else {
      clients = await Client.findAll({
        where: {
          creator_id: req.user.id
        },
        include: includeOptions,
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
