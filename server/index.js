const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Require the controller module
const controller = require('./controller');

// Setup endpoints
app.get('/api/houses', controller.getHouses);
app.post('/api/houses', controller.createHouse);
app.put('/api/houses/:id', controller.updateHouse);
app.delete('/api/houses/:id', controller.deleteHouse);

// Start the server
const port = 4004;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
