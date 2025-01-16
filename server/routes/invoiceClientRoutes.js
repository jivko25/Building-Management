const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceController/CreateClientInvoice");
const { editClientInvoice } = require("../controllers/invoiceController/EditClientInvoice");
const { getAllClientInvoices } = require("../controllers/invoiceController/GetAllClientInvoices");
const { getClientInvoiceById } = require("../controllers/invoiceController/GetClientInvoiceById");
const { getPDFClientInvoiceById } = require("../controllers/invoiceController/GetPDFClientInvoiceById");
const { updateClientInvoiceStatus } = require("../controllers/invoiceController/UpdateClientInvoiceStatus");

router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);
router.get("/", getAllClientInvoices);
router.get("/:id", getClientInvoiceById);
router.get("/:id/pdf", getPDFClientInvoiceById);
router.put("/:id/update-status", updateClientInvoiceStatus);

module.exports = router;
