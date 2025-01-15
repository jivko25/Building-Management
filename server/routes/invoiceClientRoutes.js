const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceController/CreateClientInvoice");

// Създаване на клиентска фактура
router.post("/create", createClientInvoice);


module.exports = router;
