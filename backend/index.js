const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
