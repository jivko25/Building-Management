const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceController/CreateClientInvoice");
const { editClientInvoice } = require("../controllers/invoiceController/EditClientInvoice");

// Създаване на клиентска фактура
router.post("/create", createClientInvoice);
router.put("/:id/edit", editClientInvoice);

module.exports = router;
