const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7708362',
  password: 'uy7QKbEWiN',
  database: 'sql7708362',
  port: 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define API endpoint for inserting GPS data
app.post('/api/gps', (req, res) => {
  const { deviceName, ipAddress, latitude, longitude } = req.body;

  const query = `
    INSERT INTO gps (deviceName, ipAddress, latitude, longitude, timestamp) 
    VALUES (?, ?, ?, ?, NOW())
  `;
  const values = [deviceName, ipAddress, latitude, longitude];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Data inserted into MySQL successfully');
    res.json({ message: 'Data inserted successfully' });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
