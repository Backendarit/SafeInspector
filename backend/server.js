// SafeInspector Backend API
// This Express server provides CRUD operations for Clients, Sites, and Fire Extinguishers.
// Data is stored in-memory (not in DB). When hosted in Azure, it will reset on restart.
// Endpoints are designed for use by the React Native frontend.

const express = require("express");
const cors = require("cors");
const app = express();

const clients = require("./data/clientsData");
const extinguisherRoutes = require("./routes/extinguisherRoutes");
const siteRoutes = require("./routes/siteRoutes");
const clientRoutes = require("./routes/clientRoutes"); 

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/clients", clientRoutes); 
app.use("/api/clients", siteRoutes); 
app.use("/api/clients", extinguisherRoutes); 

// Get all clients (update status)
const { calculateExtinguisherStatus } = require("./utils/extinguisherUtils");
app.get("/api/clients", (req, res) => {
  clients.forEach((client) => {
    client.sites.forEach((site) => {
      site.extinguishers.forEach((ext) => {
        ext.status = calculateExtinguisherStatus(ext);
      });
    });
  });
  res.json(clients);
});

// Root
app.get("/", (req, res) => {
  res.send("SafeInspector had an update and backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
