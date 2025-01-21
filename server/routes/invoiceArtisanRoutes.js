const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
const { getAllArtisanInvoices } = require("../controllers/invoice/invoiceArtisan/GetAllArtisanInvoicesController");
const { getArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetArtisanInvoiceByIdController");
const { updateArtisanInvoiceStatus } = require("../controllers/invoice/invoiceArtisan/UpdateArtisanInvoiceStatusController");
const { getPDFArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetPDFArtisanInvoiceByIdController");
const { getWorkItemsForArtisanInvoice } = require("../controllers/workItems/getWorkItemsForArtisanInvoiceController");

router.get("/work-items", getWorkItemsForArtisanInvoice);

// Artisan invoice routes
router.post("/create", createArtisanInvoice);
router.get("/", getAllArtisanInvoices);
router.get("/:id", getArtisanInvoiceById);
router.get("/:id/pdf", getPDFArtisanInvoiceById);
router.patch("/:id/status", updateArtisanInvoiceStatus);

module.exports = router;
