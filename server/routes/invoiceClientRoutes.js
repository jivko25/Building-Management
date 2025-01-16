const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceClient/CreateClientInvoiceController");
const { editClientInvoice } = require("../controllers/invoiceClient/EditClientInvoiceController");
const { getAllClientInvoices } = require("../controllers/invoiceClient/GetAllClientInvoicesController");
const { getClientInvoiceById } = require("../controllers/invoiceClient/GetClientInvoiceByIdController");
const { getPDFClientInvoiceById } = require("../controllers/invoiceClient/GetPDFClientInvoiceByIdController");
const { updateClientInvoiceStatus } = require("../controllers/invoiceClient/UpdateClientInvoiceStatusController");

router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);
router.get("/", getAllClientInvoices);
router.get("/:id", getClientInvoiceById);
router.get("/:id/pdf", getPDFClientInvoiceById);
router.put("/:id/update-status", updateClientInvoiceStatus);

module.exports = router;
