const express = require("express");
const router = express.Router();
const { deleteInvoice } = require("../controllers/invoice/common/DeleteInvoiceController");

// Common invoice routes
router.delete("/:id", deleteInvoice);

module.exports = router;
