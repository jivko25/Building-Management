const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
const { getAllArtisanInvoices } = require("../controllers/invoice/invoiceArtisan/GetAllArtisanInvoicesController");
const { getArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetArtisanInvoiceByIdController");
const { updateArtisanInvoiceStatus } = require("../controllers/invoice/invoiceArtisan/UpdateArtisanInvoiceStatusController");
const { getPDFArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetPDFArtisanInvoiceByIdController");
const { getWorkItemsForArtisanInvoice } = require("../controllers/workItems/getWorkItemsForArtisanInvoiceController");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/work-items", authenticateToken, getWorkItemsForArtisanInvoice);

// Artisan invoice routes
router.get("/", authenticateToken, getAllArtisanInvoices);
router.post("/create", authenticateToken, createArtisanInvoice);
router.get("/:id", getArtisanInvoiceById);
router.get("/:id/pdf", getPDFArtisanInvoiceById);
router.patch("/:id/status", updateArtisanInvoiceStatus);

module.exports = router;
