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
    res.status(400).json({ error: "Error adding Extinguisher", message: err.message });
  }
});


// Update extinguisher 
router.put('/:clientId/sites/:siteId/extinguishers/:extId', (req, res) => {
  try {
    const { clientId, siteId, extId } = req.params;
    const client = clients.find(c => c.id === clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const site = client.sites.find(s => s.id === siteId);
    if (!site) return res.status(404).json({ error: 'Site not found' });

    const ex = site.extinguishers.find(e => e.id === extId);
    if (!ex) return res.status(404).json({ error: 'Extinguisher not found' });

    const allowed = ['type','location','manufactureYear','intervalYears','notes','status','lastInspection'];
    allowed.forEach(k => {
      if (req.body[k] !== undefined) ex[k] = req.body[k];
    });

    // Calculate
    ex.nextInspection = calculateNextInspection(ex.lastInspection, ex.intervalYears);
    ex.serviceDue    = calculateServiceDueDate(ex.manufactureYear, ex.lastInspection);
    ex.status        = calculateExtinguisherStatus(ex);

    return res.json({ message: 'Extinguisher updated', extinguisher: ex });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// Update last inspection (inspect today)
router.post('/:clientId/sites/:siteId/extinguishers/:extId/inspect', (req, res) => {
  try {
    const { clientId, siteId, extId } = req.params;
    const client = clients.find(c => c.id === clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    const site = client.sites.find(s => s.id === siteId);
    if (!site) return res.status(404).json({ error: 'Site not found' });

    const ex = site.extinguishers.find(e => e.id === extId);
    if (!ex) return res.status(404).json({ error: 'Extinguisher not found' });

    // Calculate new inspection and service dates (before any updates)
    const todayStr = new Date().toISOString().split('T')[0];
    const next = calculateNextInspection(todayStr, ex.intervalYears);
    const due = calculateServiceDueDate(ex.manufactureYear, todayStr);

    // Check if inspection is blocked BEFORE updating extinguisher data 
    if (isInspectionBlocked({ ...ex, lastInspection: todayStr, nextInspection: next, serviceDue: due })) {
      return res.status(400).json({
        error: 'Inspection blocked',
        message: `Next inspection (${next}) exceeds service due (${due}).`
      });
    }

    // Update
    ex.lastInspection = todayStr;
    ex.nextInspection = next;
    ex.serviceDue    = due;
    ex.status        = calculateExtinguisherStatus(ex);

    return res.json({ message: 'Inspection completed', extinguisher: ex });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
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
