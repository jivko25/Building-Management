const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceClientController/CreateClientInvoice");
const { editClientInvoice } = require("../controllers/invoiceClientController/EditClientInvoice");
const { getAllClientInvoices } = require("../controllers/invoiceClientController/GetAllClientInvoices");
const { getClientInvoiceById } = require("../controllers/invoiceClientController/GetClientInvoiceById");
const { getPDFClientInvoiceById } = require("../controllers/invoiceClientController/GetPDFClientInvoiceById");
const { updateClientInvoiceStatus } = require("../controllers/invoiceClientController/UpdateClientInvoiceStatus");

router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);
router.get("/", getAllClientInvoices);
router.get("/:id", getClientInvoiceById);
router.get("/:id/pdf", getPDFClientInvoiceById);
router.put("/:id/update-status", updateClientInvoiceStatus);

module.exports = router;
