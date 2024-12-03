const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const { getPaginatedCompanies } = require('../controllers/companies/getCompaniesController');
const { editCompany } = require('../controllers/companies/editCompanyController');
const { createCompany } = require('../controllers/companies/createCompanyController');
const { getCompanyById } = require('../controllers/companies/getCompanyByIdController');

const router = express.Router();

router.get('/companies', authenticateToken, getPaginatedCompanies);
router.get('/companies/:id', authenticateToken, getCompanyById);
router.post('/companies/create', authenticateToken, createCompany);
router.put('/companies/:id/edit', authenticateToken, editCompany);

module.exports = router;