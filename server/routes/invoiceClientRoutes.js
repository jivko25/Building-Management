const express = require("express");
const router = express.Router();
const { createClientInvoice } = require("../controllers/invoice/invoiceClient/CreateClientInvoiceController");
const { editClientInvoice } = require("../controllers/invoice/invoiceClient/EditClientInvoiceController");
const { getAllClientInvoices } = require("../controllers/invoice/invoiceClient/GetAllClientInvoicesController");
const { getClientInvoiceById } = require("../controllers/invoice/invoiceClient/GetClientInvoiceByIdController");
const { getPDFClientInvoiceById } = require("../controllers/invoice/invoiceClient/GetPDFClientInvoiceByIdController");
const { updateClientInvoiceStatus } = require("../controllers/invoice/invoiceClient/UpdateClientInvoiceStatusController");
const { getWorkItemsForClientInvoice } = require("../controllers/workItems/getWorkItemsForClientInvoiceController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/work-items", authenticateToken, getWorkItemsForClientInvoice);
router.get("/", authenticateToken, getAllClientInvoices);
router.post("/create", authenticateToken, createClientInvoice);

router.get("/:id/pdf", getPDFClientInvoiceById);
router.get("/:id",getClientInvoiceById);
router.put("/:id/edit", editClientInvoice);
router.patch("/:id/status", updateClientInvoiceStatus);

module.exports = router;
