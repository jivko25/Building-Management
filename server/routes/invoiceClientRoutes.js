const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoice/invoiceClient/CreateClientInvoiceController");
const { editClientInvoice } = require("../controllers/invoice/invoiceClient/EditClientInvoiceController");
const { getAllClientInvoices } = require("../controllers/invoice/invoiceClient/GetAllClientInvoicesController");
const { getClientInvoiceById } = require("../controllers/invoice/invoiceClient/GetClientInvoiceByIdController");
const { getPDFClientInvoiceById } = require("../controllers/invoice/invoiceClient/GetPDFClientInvoiceByIdController");
const { updateClientInvoiceStatus } = require("../controllers/invoice/invoiceClient/UpdateClientInvoiceStatusController");
const { deleteClientInvoice } = require("../controllers/invoice/invoiceClient/DeleteClientInvoiceController");

router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);
router.get("/", getAllClientInvoices);
router.get("/:id", getClientInvoiceById);
router.get("/:id/pdf", getPDFClientInvoiceById);
router.put("/:id/update-status", updateClientInvoiceStatus);
router.delete("/:id", deleteClientInvoice);

module.exports = router;
