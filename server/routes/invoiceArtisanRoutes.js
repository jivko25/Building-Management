const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
const { getAllArtisanInvoices } = require("../controllers/invoice/invoiceArtisan/GetAllArtisanInvoicesController");
const { getArtisanInvoiceById } = require("../controllers/invoice/invoiceArtisan/GetArtisanInvoiceByIdController");

// Artisan invoice routes
router.post("/create", createArtisanInvoice);
router.get("/", getAllArtisanInvoices);
router.get("/:id", getArtisanInvoiceById);

module.exports = router;
