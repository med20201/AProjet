const express = require("express");
const mysql = require("mysql");
const fs = require("fs");

const app = express();
const port = 3000;

// Create connection pool
const pool = mysql.createPool({
  host: "sql7.freesqldatabase.com",
  user: "sql7708362",
  password: "uy7QKbEWiN",
  database: "sql7708362"
});

// Middleware to parse JSON
app.use(express.json());

// Route to handle retrieving GPS data
app.get("/gps", (req, res) => {
  pool.query("SELECT * FROM gps", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving data");
      return;
    }
    res.json(results);
  });
});

// Route to handle inserting JSON data
app.post("/gps", (req, res) => {
  try {
    const jsonData = fs.readFileSync("db.json");
    const data = JSON.parse(jsonData);

    const insertData = data.gps.map((item) => [
      item.id,
      item.latitude,
      item.longitude,
      item.ipAddress,
    ]);

    pool.query(
      "INSERT INTO gps (id, deviceName, ipAddress, latitude, longitude) VALUES (?,?,?,?)",
      [insertData],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error inserting data");
          return;
        }
        res.send("Data inserted successfully");
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error reading JSON file");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
