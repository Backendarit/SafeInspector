const express = require("express");
const router = express.Router();
const clients = require("../data/clientsData");



// --- SITE CRUD ---
// Get single site
router.get("/:clientId/sites/:siteId", (req, res) => {
  const { clientId, siteId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  res.json(site);
});

// Add new site
router.post("/:clientId/sites", (req, res) => {
  const { clientId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const { name, address, contact, coords } = req.body;
  if (!name || !address) {
    return res.status(400).json({ error: "Name and address are required" });
  }

  const newSite = {
    id: String(client.sites.length + 1),
    name,
    address,
    contact: contact || { name: "", phone: "" },
    extinguishers: [],
    coords: coords || null,
  };

  client.sites.push(newSite);
  res.status(201).json({ message: "Site added", site: newSite });
});

// Update site --ONLY POSTMAN--
router.put("/:clientId/sites/:siteId", (req, res) => {
  const { clientId, siteId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const { name, address, contact, coords } = req.body;

  if (name) site.name = name;
  if (address) site.address = address;
  if (contact) {
    site.contact = { ...site.contact, ...contact }; // merge new contact info
  }
  if (coords) {
    site.coords = coords; // save updated coords
  }

  res.json({ message: "Site updated", site });
});


// DELETE site --ONLY POSTMAN--
router.delete("/:clientId/sites/:siteId", (req, res) => {
  const { clientId, siteId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const siteIndex = client.sites.findIndex((s) => s.id === siteId);
  if (siteIndex === -1) return res.status(404).json({ error: "Site not found" });

  client.sites.splice(siteIndex, 1);
  res.status(204).send();
});

module.exports = router;