const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
const { getAllArtisanInvoices } = require("../controllers/invoice/invoiceArtisan/GetAllArtisanInvoicesController");

// Artisan invoice routes
router.post("/create", createArtisanInvoice);
router.get("/", getAllArtisanInvoices);

module.exports = router;
