//server\routes\defaultPricingRoutes.js
const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { getDefaultPricing } = require("../controllers/defaultPricing/getDefaultPricingController");
const { createDefaultPricing } = require("../controllers/defaultPricing/createDefaultPricingController");
const { removeDefaultPricing } = require("../controllers/defaultPricing/removeDefaultPricingController");
const { editDefaultPricing } = require("../controllers/defaultPricing/editDefaultPricingController");
const { getDefaultPricingById } = require("../controllers/defaultPricing/getDefaultPricingByIdController");
const { getDefaultPricingForProject } = require("../controllers/defaultPricing/getDefaultPricingForProjectController");
const router = express.Router();

router.get("/default-pricing/:id", authenticateToken, getDefaultPricing);
router.get("/default-pricing", authenticateToken, getDefaultPricing);
router.get("/default-pricing/get-by-id/:id", authenticateToken, getDefaultPricingById);
router.get("/default-pricing/get-by-project/:id/:taskId", authenticateToken, getDefaultPricingForProject);
router.post("/default-pricing/:id", authenticateToken, createDefaultPricing);
router.post("/default-pricing", authenticateToken, createDefaultPricing);
router.put("/default-pricing/:id", authenticateToken, editDefaultPricing);
router.delete("/default-pricing/:id", authenticateToken, removeDefaultPricing);

module.exports = router;
