const express = require("express");
const router = express.Router();
const { createArtisanInvoice, getArtisanInvoicePDF, updateArtisanInvoice, deleteArtisanInvoice } = require("../controllers/invoiceClient/invoiceControllerController");

// Създаване на фактура за майстор
router.post("/", createArtisanInvoice);

// Вземане на PDF за майсторска фактура
router.get("/:id/pdf", getArtisanInvoicePDF);

// Обновяване на майсторска фактура (например маркиране като платена)
router.put("/:id", updateArtisanInvoice);

// Изтриване на майсторска фактура
router.delete("/:id", deleteArtisanInvoice);

module.exports = router;
