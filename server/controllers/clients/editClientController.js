const db = require("../../data/index.js");
const { Client } = db;
const ApiError = require("../../utils/apiError");

const editClient = async (req, res, next) => {
  console.log("Editing client with data:", req.body);
  const clientId = req.params.id;
  const { client_company_name, client_name, client_company_address, client_company_iban, client_emails, status, client_company_vat_number, invoice_language_id, due_date, postal_code } = req.body;

  try {
    const client = await Client.findByPk(clientId);

    if (!client) {
      throw new ApiError(404, "Client not found!");
    }

    const updatedClient = await client.update({
      client_company_name,
      client_name,
      postal_code,
      client_company_address,
      client_company_iban,
      client_emails,
      status,
      client_company_vat_number,
      invoice_language_id,
      due_date
    });

    res.json({
      message: "Client updated successfully!",
      client: updatedClient
    });
  } catch (error) {
    console.error("Error updating client:", error);
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(500, "Internal server Error!"));
    }
  }
};

module.exports = {
  editClient
};
