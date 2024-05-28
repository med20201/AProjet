const mysql = require('mysql');
const fs = require('fs');

// Read data from db.json
const jsonData = fs.readFileSync('db.json');
const data = JSON.parse(jsonData);

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  user: "sql7708362",
  password: "uy7QKbEWiN",
  database: "sql7708362"
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Fetch current data from the database
  connection.query('SELECT * FROM gps', (err, results) => {
    if (err) {
      console.error('Error fetching data from MySQL database:', err);
      connection.end();
      return;
    }

    // Create a map of current data in the database
    const dbDataMap = new Map();
    results.forEach(item => {
      dbDataMap.set(item.deviceName, item);
    });

    let processedCount = 0;
    const totalItems = data.gps.length;

    // Iterate over the JSON data and update or insert as necessary
    data.gps.forEach((item) => {
      const dbItem = dbDataMap.get(item.deviceName);

      if (dbItem) {
        // Item exists in database, so update it if any field has changed
        if (dbItem.ipAddress !== item.ipAddress || dbItem.latitude !== item.latitude || dbItem.longitude !== item.longitude || new Date(dbItem.timestamp).getTime() !== new Date(item.timestamp).getTime()) {
          const updateSql = `
            UPDATE gps SET
              ipAddress = ?,
              latitude = ?,
              longitude = ?,
              timestamp = ?
            WHERE deviceName = ?
          `;
          const updateValues = [item.ipAddress, item.latitude, item.longitude, item.timestamp, item.deviceName];

          connection.query(updateSql, updateValues, (err, result) => {
            if (err) {
              console.error('Error updating data in MySQL database:', err);
              return;
            }
            console.log('Data updated successfully:', result);

            processedCount++;
            if (processedCount === totalItems) {
              // Close the connection after all items have been processed
              connection.end((err) => {
                if (err) {
                  console.error('Error closing MySQL connection:', err);
                  return;
                }
                console.log('Connection to MySQL database closed');
              });
            }
          });
        } else {
          processedCount++;
          if (processedCount === totalItems) {
            // Close the connection after all items have been processed
            connection.end((err) => {
              if (err) {
                console.error('Error closing MySQL connection:', err);
                return;
              }
              console.log('Connection to MySQL database closed');
            });
          }
        }
      } else {
        // Item does not exist in database, so insert it
        const insertSql = `
          INSERT INTO gps (deviceName, ipAddress, latitude, longitude, timestamp)
          VALUES (?, ?, ?, ?, ?)
        `;
        const insertValues = [item.deviceName, item.ipAddress, item.latitude, item.longitude, item.timestamp];

        connection.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error('Error inserting data into MySQL database:', err);
            return;
          }
          console.log('Data inserted successfully:', result);

          processedCount++;
          if (processedCount === totalItems) {
            // Close the connection after all items have been processed
            connection.end((err) => {
              if (err) {
                console.error('Error closing MySQL connection:', err);
                return;
              }
              console.log('Connection to MySQL database closed');
            });
          }
        });
      }
    });
  });
});
