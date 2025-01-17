const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
const { getAllArtisanInvoices } = require("../controllers/invoice/invoiceArtisan/GetAllArtisanInvoicesController");
const { getArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetArtisanInvoiceByIdController");
const { updateArtisanInvoiceStatus } = require("../controllers/invoice/invoiceArtisan/UpdateArtisanInvoiceStatusController");

// Artisan invoice routes
router.post("/create", createArtisanInvoice);
router.get("/", getAllArtisanInvoices);
router.get("/:id", getArtisanInvoiceById);
router.patch("/:id/status", updateArtisanInvoiceStatus);

module.exports = router;
