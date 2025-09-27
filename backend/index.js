const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock database
let clients = [
  { id: 1, name: "Test Client A" },
  { id: 2, name: "Test Client B" }
];

// GET all clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// GET single client
app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  client ? res.json(client) : res.status(404).json({ error: "Client not found" });
});

// CREATE client
app.post('/api/clients', (req, res) => {
  const newClient = {
    id: clients.length + 1,
    name: req.body.name
  };
  clients.push(newClient);
  res.status(201).json(newClient);
});

// UPDATE client
app.put('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ error: "Client not found" });
  client.name = req.body.name || client.name;
  res.json(client);
});

// DELETE client
app.delete('/api/clients/:id', (req, res) => {
  clients = clients.filter(c => c.id !== parseInt(req.params.id));
  res.status(204).end();
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
