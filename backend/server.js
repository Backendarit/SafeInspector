// SafeInspector Backend API
// This Express server provides CRUD operations for Clients, Sites, and Fire Extinguishers.
// Data is stored in-memory (not in DB). When hosted in Azure, it will reset on restart.
// Endpoints are designed for use by the React Native frontend.

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


// Routes
const extinguisherRoutes = require("./routes/extinguisherRoutes");
const siteRoutes = require("./routes/siteRoutes");
const clientRoutes = require("./routes/clientRoutes"); 

app.use("/api/clients", clientRoutes); 
app.use("/api/clients", siteRoutes); 
app.use("/api/clients", extinguisherRoutes); 


// Root
app.get("/", (req, res) => {
  res.send(`SafeInspector backend updated 24/10/2025 klo 23 and is hopefully running successfully!`);
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
