const db = require("../../data/index.js");
const { Client, User, InvoiceLanguage } = db;
const ApiError = require("../../utils/apiError");

const getClientById = async (req, res, next) => {
  console.log("Fetching client by ID:", req.params.id);
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [
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
      ]
    });

    if (!client) {
      throw new ApiError(404, "Client not found!");
    }

    console.log("Client found:", client.id);
    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  getClientById
};
