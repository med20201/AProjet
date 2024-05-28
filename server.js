const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import CORS middleware

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS middleware

// MySQL database connection configuration
const connection = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7708362",
  password: "uy7QKbEWiN",
  database: "sql7708362",
  port: 3306,
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Endpoint to insert data
app.post('/gps', async (req, res) => {
  const newItem = req.body;

  try {
    // Insert new item into the database
    connection.query('INSERT INTO gps SET ?', newItem, (err, results) => {
      if (err) {
        console.error('Error inserting item into database:', err);
        res.status(500).json({ error: 'Error inserting item into database' });
        return;
      }
      console.log('New item added:', newItem);
      res.json({ success: true, message: 'Data inserted successfully' });
    });
  } catch (err) {
    console.error('Error interacting with database:', err);
    res.status(500).json({ error: 'Error interacting with database' });
  }
});

// Start the server
const port = 5002;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
