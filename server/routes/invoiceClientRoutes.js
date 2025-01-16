const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoiceController/CreateClientInvoice");
const { editClientInvoice } = require("../controllers/invoiceController/EditClientInvoice");
const { getAllClientInvoices } = require("../controllers/invoiceController/GetAllClientInvoices");
const { getClientInvoiceById } = require("../controllers/invoiceController/GetClientInvoiceById");

// Създаване на клиентска фактура
router.post("/create", createClientInvoice);

// Редактиране на клиентска фактура
router.put("/:id/edit", editClientInvoice);

// Взимане на всички клиентски фактури
router.get("/", getAllClientInvoices);

// Взимане на клиентска фактура по ID
router.get("/:id", getClientInvoiceById);

module.exports = router;
