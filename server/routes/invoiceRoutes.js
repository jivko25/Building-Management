const express = require("express");
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById } = require("../controllers/invoiceController/invoiceController");

router.post("/invoices", createInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getInvoiceById);

module.exports = router;
