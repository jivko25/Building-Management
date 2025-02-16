//server\routes\companyRoutes.js
const express = require("express");
const upload = require("../configs/multerConfig").upload;
const authenticateToken = require("../middlewares/authenticateToken");
const { getPaginatedCompanies } = require("../controllers/companies/getCompaniesController");
const { editCompany, uploadCompanyLogo, deleteCompanyLogo } = require("../controllers/companies/editCompanyController");
const { createCompany } = require("../controllers/companies/createCompanyController");
const { getCompanyById } = require("../controllers/companies/getCompanyByIdController");

const router = express.Router();

router.get("/companies", authenticateToken, getPaginatedCompanies);
router.get("/companies/:id", authenticateToken, getCompanyById);
router.post("/companies/create", authenticateToken, createCompany);
router.post("/companies/:id/image", authenticateToken, upload.single("image"), uploadCompanyLogo);
router.put("/companies/:id/edit", authenticateToken, editCompany);
router.delete("/companies/:id/image", deleteCompanyLogo);

module.exports = router;
