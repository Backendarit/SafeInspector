const express = require("express");
const router = express.Router();
const clients = require("../data/clientsData");

// --- CLIENT CRUD ---
// GET all clients
router.get("/", (req, res) => {
  res.json(clients);
});

// GET single client by ID
router.get("/:id", (req, res) => {
  const client = clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  res.json(client);
});

// Add new client
router.post("/", (req, res) => {
  const { name, businessId, sites = [] } = req.body;
  if (!name) return res.status(400).json({ error: "Client name is required" });

  const newClient = {
    id: String(clients.length + 1),
    name,
    businessId: businessId || "",
    sites,
  };

  clients.push(newClient);
  res.status(201).json({ message: "Client added", client: newClient });
});

// Update client
router.put("/:id", (req, res) => {
  const client = clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const { name, businessId } = req.body;
  if (name) client.name = name;
  if (businessId) client.businessId = businessId;

  res.json({ message: "Client updated", client });
});

// DELETE client
router.delete("/:id", (req, res) => {
  const index = clients.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Client not found" });

  clients.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
