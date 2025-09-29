// SafeInspector Backend API
// This Express server provides CRUD operations for Clients, Sites, and Fire Extinguishers.
// Data is stored in-memory (not in DB). When hosted in Azure, it will reset on restart.
// Endpoints are designed for use by the React Native frontend.

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SafeInspector backend is running!!");
});


// JSON Data 
let clients = [
  {
    id: "1",
    name: "Sale-R Oy",
    businessId: "1234567-8",
    sites: [
      {
        id: "1",
        name: "Sale Härmälänranta Tampere",
        address: "Lentovarikonkatu 1, 33900 Tampere",
        contact: {
          name: "Maija Menninkäinen",
          phone: "040 123 456",
        },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2023-09-01",
            intervalYears: 2,
            nextInspection: "2025-09-01",
            serviceDue: 2028,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-09-01",
            intervalYears: 2,
            nextInspection: "2025-09-01",
            serviceDue: 2026,
            status: "Needs service",
            notes: "Replace label or send to service",
          },
        ],
      },
      {
        id: "2",
        name: "Sale Hatanpää Tampere",
        address: "Hatanpään puistokuja 29, 33900 Tampere",
        contact: {
          name: "Tarja Menninkäinen",
          phone: "040 123 455",
        },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2023-09-02",
            intervalYears: 2,
            nextInspection: "2025-09-02",
            serviceDue: 2028,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 12kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-09-02",
            intervalYears: 2,
            nextInspection: "2025-09-02",
            serviceDue: 2026,
            status: "Needs service",
            notes: "1-year label or send to service",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Property Management Tampere",
    businessId: "1234567-8",
    sites: [
      {
        id: "1",
        name: "Housing Company Aktuaari",
        address: "Kortelahdenkatu 15, 33210 Tampere",
        contact: {
          name: "Nelli Matula",
          phone: "040 123 454",
        },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2019,
            lastInspection: "2023-10-02",
            intervalYears: 2,
            nextInspection: "2025-10-02",
            serviceDue: 2029,
            status: "OK",
            notes: "",
          },
        ],
      },
      {
        id: "2",
        name: "Housing Company Sotkankatu 16",
        address: "Sotkankatu 16, 33230 Tampere",
        contact: {
          name: "Olivia Terttu",
          phone: "040 123 453",
        },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Staircase A",
            manufactureYear: 2018,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            nextInspection: "2027-06-02",
            serviceDue: 2028,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Staircase B",
            manufactureYear: 2016,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            nextInspection: "2025-09-01",
            serviceDue: 2026,
            status: "Needs service",
            notes: "Replace in 05/2026",
          },
        ],
      },
    ],
  },
];

// --- CLIENT CRUD ---

// GET Clients
app.get("/api/clients", (req, res) => {
  res.json(clients);
});

// Get single client
app.get("/api/clients/:id", (req, res) => {
  const client = clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  res.json(client);
});

// Add new client
app.post("/api/clients", (req, res) => {
  const { name, businessId, sites = [] } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });

  const newClient = {
    id: String(clients.length + 1),
    name,
    businessId,
    sites,
  };

  clients.push(newClient);
  res.status(201).json({ message: "Client added", client: newClient });
});


// Update client
app.put("/api/clients/:id", (req, res) => {
  const client = clients.find((c) => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const { name, businessId } = req.body;
  if (name) client.name = name;
  if (businessId) client.businessId = businessId;

  res.json({ message: "Client updated", client });
});

// Delete client
app.delete("/api/clients/:id", (req, res) => {
  const index = clients.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Client not found" });

  clients.splice(index, 1);
  res.status(204).send();
});

// --- SITE CRUD ---
// Get single site
app.get("/api/clients/:clientId/sites/:siteId", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  res.json(site);
});

// Update site
app.put("/api/clients/:clientId/sites/:siteId", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const { name, address, contact } = req.body;
  if (name) site.name = name;
  if (address) site.address = address;
  if (contact) {
    site.contact = { ...site.contact, ...contact }; // Merge contact info
  }

  res.json({ message: "Site updated", site });
});

// Delete site
app.delete("/api/clients/:clientId/sites/:siteId", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const siteIndex = client.sites.findIndex((s) => s.id === req.params.siteId);
  if (siteIndex === -1) return res.status(404).json({ error: "Site not found" });

  client.sites.splice(siteIndex, 1);
  res.status(204).send();
});

// --- EXTINGUISHER CRUD ---
// Add extinguisher
app.post("/api/clients/:clientId/sites/:siteId/extinguishers", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const extinguisher = req.body;
  extinguisher.id = String(site.extinguishers.length + 1); // auto-generate ID
  site.extinguishers.push(extinguisher);

  res.status(201).json({ message: "Extinguisher added", extinguisher });
});

// Update extinguisher
app.put("/api/clients/:clientId/sites/:siteId/extinguishers/:extId", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const extinguisher = site.extinguishers.find((e) => e.id === req.params.extId);
  if (!extinguisher) return res.status(404).json({ error: "Extinguisher not found" });

  Object.assign(extinguisher, req.body);
  res.json({ message: "Extinguisher updated", extinguisher });
});


// Delete extinguisher
app.delete("/api/clients/:clientId/sites/:siteId/extinguishers/:extId", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const index = site.extinguishers.findIndex((e) => e.id === req.params.extId);
  if (index === -1) return res.status(404).json({ error: "Extinguisher not found" });

  site.extinguishers.splice(index, 1);
  res.status(204).send();
});

// --Inspection Update
// Quick endpoint to update extinguisher inspection date to today
app.put("/api/clients/:clientId/sites/:siteId/extinguishers/:extId/inspect", (req, res) => {
  const client = clients.find((c) => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const site = client.sites.find((s) => s.id === req.params.siteId);
  if (!site) return res.status(404).json({ error: "Site not found" });

  const extinguisher = site.extinguishers.find((e) => e.id === req.params.extId);
  if (!extinguisher) return res.status(404).json({ error: "Extinguisher not found" });

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  extinguisher.lastInspection = today;

  const next = new Date(today);
  next.setFullYear(next.getFullYear() + extinguisher.intervalYears);
  extinguisher.nextInspection = next.toISOString().split("T")[0];
  extinguisher.serviceDue = extinguisher.manufactureYear + 10;

  res.json({ message: "Inspection updated", extinguisher });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
