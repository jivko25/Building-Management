const express = require("express");
const router = express.Router();
const { createArtisanInvoice, getArtisanInvoicePDF, updateArtisanInvoice, deleteArtisanInvoice } = require("../controllers/invoice/invoiceArtisan/CreateArtisanInvoiceController");
// const { getArtisanInvoiceById } = require("../controllers/invoiceArtisan/GetArtisanInvoiceByIdController");
// const { getPDFArtisanInvoiceById } = require("../controllers/invoiceArtisan/GetPDFArtisanInvoiceByIdController");
// const { updateArtisanInvoiceStatus } = require("../controllers/invoiceArtisan/UpdateArtisanInvoiceStatusController");
// const { editArtisanInvoice } = require("../controllers/invoiceArtisan/EditArtisanInvoiceController");

router.post("/create", createArtisanInvoice);
// router.get("/:id/pdf", getArtisanInvoicePDF);
// router.put("/:id", updateArtisanInvoice);
// router.delete("/:id", deleteArtisanInvoice);
// router.put("/:id/edit", editArtisanInvoice);

module.exports = router;
