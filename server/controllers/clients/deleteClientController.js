const db = require("../../data/index.js");
const { Client } = db;
const ApiError = require("../../utils/apiError");

const deleteClient = async (req, res, next) => {
  console.log("Deleting client:", req.params.id);
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      throw new ApiError(404, "Client not found!");
    }

    await client.destroy();
    console.log("Client deleted successfully");

    res.json({
      message: "Client deleted successfully!"
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  deleteClient
};
