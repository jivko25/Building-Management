const db = require("../../data/index.js");
const { Client } = db;
const ApiError = require("../../utils/apiError");

const createClient = async (req, res, next) => {
  console.log("Creating new client with data:", req.body);
  const { client_company_name, client_name, client_company_address, client_company_iban, client_emails, status, client_company_vat_number, invoice_language_id, due_date } = req.body;

  try {
    const existingClient = await Client.findOne({
      where: {
        client_company_name,
        client_name
      }
    });

    if (existingClient) {
      throw new ApiError(400, "Client already exists!");
    }

    const newClient = await Client.create({
      client_company_name,
      client_name,
      client_company_address,
      client_company_iban,
      client_emails,
      status,
      creator_id: req.user.id,
      client_company_vat_number,
      invoice_language_id: invoice_language_id || 1,
      due_date: due_date || 30
    });

    console.log("Client created successfully:", newClient.id);
    res.status(201).json({
      message: "Client created successfully!",
      client: newClient
    });
  } catch (error) {
    console.error("Error creating client:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  createClient
};
