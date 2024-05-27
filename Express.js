const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4000;

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7706592',
  password: 'XVGX8pF1dS',
  database: 'sql7706592'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle saving data
app.post('/gps', (req, res) => {
  const { uniqueId, ipAddress, latitude, longitude } = req.body;

  // Insert data into the database
  const sql = 'INSERT INTO LocationData (uniqueId, ipAddress, latitude, longitude) VALUES (?, ?, ?, ?)';
  const values = [uniqueId, ipAddress, latitude, longitude];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving data to MySQL:', err);
      res.status(500).json({ error: 'An error occurred while saving data to MySQL' });
      return;
    }
    console.log('Data saved to MySQL database');
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
