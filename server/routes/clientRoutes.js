const express = require("express");
const router = express.Router();
const { createClient } = require("../controllers/clients/createClientController");
const { getClients } = require("../controllers/clients/getClientsController");
const { getClientById } = require("../controllers/clients/getClientByIdController");
const { editClient } = require("../controllers/clients/editClientController");
const { deleteClient } = require("../controllers/clients/deleteClientController");
const authenticateToken = require("../middlewares/authenticateToken");

router.use(authenticateToken);

router.post("/", createClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", editClient);
router.delete("/:id", deleteClient);
router.get("/test", (req, res) => {
  res.json({ message: "Clients route is working!" });
});

module.exports = router;
