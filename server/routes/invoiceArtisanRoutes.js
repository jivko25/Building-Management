const express = require("express");
const router = express.Router();
const { createArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");

router.post("/create", createArtisanInvoice);

module.exports = router;
