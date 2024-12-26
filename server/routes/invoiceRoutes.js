const express = require("express");
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById, deleteInvoice } = require("../controllers/invoiceController/invoiceController");

router.post("/invoices", createInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getInvoiceById);
router.delete("/invoices/:id", deleteInvoice);

module.exports = router;
