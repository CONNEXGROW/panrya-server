const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Username and password for basic authentication
const ADMIN_USERNAME = "system";
const ADMIN_PASSWORD = "djganja@24";

// Middleware for authentication
const authenticate = (req, res, next) => {
  const { username, password } = req.body;

  // Verify username and password
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    next(); // Proceed to the next middleware or route
  } else {
    res.status(401).json({ message: "Unauthorized: Invalid username or password" });
  }
};

// Serve static files
app.use(express.static(__dirname));

// Load data from 'data.json'
const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync('data.json', 'utf8'));
  } catch (error) {
    return [];
  }
};

// Save data to 'data.json'
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Get all data (Public Endpoint)
app.get('/api/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

// Add new data (Protected Endpoint)
app.post('/api/data', authenticate, (req, res) => {
  const newData = req.body;
  const data = loadData();
  data.push(newData);
  saveData(data);
  res.json({ message: 'Data added successfully!' });
});

// Delete data by index (Protected Endpoint)
app.delete('/api/data/:index', authenticate, (req, res) => {
  const index = parseInt(req.params.index, 10);
  let data = loadData();
  data = data.filter((_, i) => i !== index);
  saveData(data);
  res.json({ message: 'Data deleted successfully!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
