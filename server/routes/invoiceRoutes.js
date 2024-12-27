const express = require("express");
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById, deleteInvoice, updateInvoice, getInvoicePDF, updateInvoiceStatus } = require("../controllers/invoiceController/invoiceController");

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:id/pdf", getInvoicePDF);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);
router.put("/:id", updateInvoice);
router.patch("/:id/status", updateInvoiceStatus);

module.exports = router;
