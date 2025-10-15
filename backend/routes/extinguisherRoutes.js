const express = require("express");
const router = express.Router();
const Extinguisher = require("../models/Extinguisher");
const clients = require("../data/clientsData");
const {
  calculateExtinguisherStatus,
  calculateNextInspection,
  calculateServiceDueDate,
  isInspectionBlocked
} = require("../utils/extinguisherUtils");


// --- EXTINGUISHER CRUD ---
// Add extinguisher
router.post("/:clientId/sites/:siteId/extinguishers", (req, res) => {
  const { clientId, siteId } = req.params;
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  try {
    const newId = String(site.extinguishers.length + 1);
    const extinguisher = new Extinguisher({ ...req.body, id: newId });
    site.extinguishers.push(extinguisher);
    res.status(201).json({ message: "Extinguisher added", extinguisher });
  } catch (err) {
    res.status(400).json({ error: "Inspection blocked", message: err.message });
  }
});


// Update extinguisher or perform inspection
router.put("/:clientId/sites/:siteId/extinguishers/:extId/inspect", (req, res) => {
  try {
    const { clientId, siteId, extId } = req.params;
    const { inspectToday } = req.body;

    // Find client and site 
    const client = clients.find((c) => c.id === clientId);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const site = client.sites.find((s) => s.id === siteId);
    if (!site) return res.status(404).json({ error: "Site not found" });

    const extinguisher = site.extinguishers.find((e) => e.id === extId);
    if (!extinguisher) return res.status(404).json({ error: "Extinguisher not found" });

    // Calculate new inspection and service dates (before any updates)
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const lastInspection = inspectToday ? todayStr : extinguisher.lastInspection;
    const nextInspection = calculateNextInspection(lastInspection, extinguisher.intervalYears);
    const serviceDue = calculateServiceDueDate(extinguisher.manufactureYear, lastInspection);

    // Check if inspection is blocked BEFORE updating extinguisher data 
    const simulatedExt = { ...extinguisher, nextInspection, serviceDue };
    if (isInspectionBlocked(simulatedExt)) {
      return res.status(400).json({
        error: "Inspection blocked",
        message: `Cannot inspect extinguisher. Next inspection exceeds service due.`,
      });
    }

    // Apply updates (only if not blocked) 
    Object.assign(extinguisher, req.body);

    extinguisher.lastInspection = lastInspection;
    extinguisher.nextInspection = nextInspection;
    extinguisher.serviceDue = serviceDue;
    extinguisher.status = calculateExtinguisherStatus(extinguisher);

    // Return success response 
    return res.status(200).json({
      message: inspectToday
        ? "Inspection completed successfully"
        : "Extinguisher updated successfully",
      extinguisher,
    });

  } catch (err) {
    console.error("Error updating extinguisher:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
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
