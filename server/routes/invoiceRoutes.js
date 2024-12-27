const express = require("express");
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoiceById, deleteInvoice, updateInvoice, getInvoicePDF } = require("../controllers/invoiceController/invoiceController");

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:id/pdf", getInvoicePDF);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);
router.put("/:id", updateInvoice);

module.exports = router;
