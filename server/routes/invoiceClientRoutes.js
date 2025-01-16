const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceClient/CreateClientInvoice");
const { editClientInvoice } = require("../controllers/invoiceClient/EditClientInvoice");
const { getAllClientInvoices } = require("../controllers/invoiceClient/GetAllClientInvoices");
const { getClientInvoiceById } = require("../controllers/invoiceClient/GetClientInvoiceById");
const { getPDFClientInvoiceById } = require("../controllers/invoiceClient/GetPDFClientInvoiceById");
const { updateClientInvoiceStatus } = require("../controllers/invoiceClient/UpdateClientInvoiceStatus");

router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);
router.get("/", getAllClientInvoices);
router.get("/:id", getClientInvoiceById);
router.get("/:id/pdf", getPDFClientInvoiceById);
router.put("/:id/update-status", updateClientInvoiceStatus);

module.exports = router;
