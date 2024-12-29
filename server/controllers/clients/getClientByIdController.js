const db = require("../../data/index.js");
const { Client, User } = db;
const ApiError = require("../../utils/apiError");

const getClientById = async (req, res, next) => {
  try {
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
      throw new ApiError(404, "Client not found!");
    }

    res.json(client);
  } catch (error) {
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
