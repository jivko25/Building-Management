const express = require("express");
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById, deleteInvoice, updateInvoice, getInvoicePDF } = require("../controllers/invoiceController/invoiceController");

router.post("/invoices", createInvoice);
router.get("/invoices", getAllInvoices);
router.get("/invoices/:id", getInvoiceById);
router.delete("/invoices/:id", deleteInvoice);
router.put("/invoices/:id", updateInvoice);
router.get("/invoices/:id/pdf", getInvoicePDF);

module.exports = router;
