const express = require("express");
const router = express.Router();
const Extinguisher = require("../models/Extinguisher");
const clients = require("../data/clientsData");
const { calculateExtinguisherStatus, isInspectionBlocked } = require("../utils/extinguisherUtils");

// --- EXTINGUISHER CRUD ---
// Add extinguisher
router.post("/:clientId/sites/:siteId/extinguishers", (req, res) => {
  const { clientId, siteId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  try {
    const extinguisher = new Extinguisher(req.body);
    site.extinguishers.push(extinguisher);
    res.status(201).json({ message: "Extinguisher added", extinguisher });
  } catch (err) {
    res.status(400).json({ error: "Inspection blocked", message: err.message });
  }
});

// Update Extinguisher
router.put("/:clientId/sites/:siteId/extinguishers/:extId/inspect", (req, res) => {
  const { clientId, siteId, extId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const extinguisher = site.extinguishers.find((e) => e.id === extId);
  if (!extinguisher) return res.status(404).json({ error: "Extinguisher not found" });

  // Update base fields if provided
  const updates = req.body;
  Object.assign(extinguisher, updates); // merges only provided fields

  // Simulate inspection
  const today = new Date().toISOString().split("T")[0];
  extinguisher.lastInspection = today;
  extinguisher.nextInspection = new Date(today);
  extinguisher.nextInspection.setFullYear(
    extinguisher.nextInspection.getFullYear() + extinguisher.intervalYears
  );
  extinguisher.nextInspection = extinguisher.nextInspection.toISOString().split("T")[0];

  // Check service due
  if (isInspectionBlocked(extinguisher)) {
    return res.status(400).json({
      error: "Inspection blocked",
      message: `Cannot inspect extinguisher. Next inspection exceeds service due.`,
    });
  }

  extinguisher.status = calculateExtinguisherStatus(extinguisher);

  res.json({ message: "Inspection updated", extinguisher });
});

// Delete extinguisher
router.delete("/:clientId/sites/:siteId/extinguishers/:extId", (req, res) => {
  const { clientId, siteId, extId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const index = site.extinguishers.findIndex((e) => e.id === extId);
  if (index === -1) return res.status(404).json({ error: "Extinguisher not found" });

  site.extinguishers.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
