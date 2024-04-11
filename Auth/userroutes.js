const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const db = require('../db'); // Import the MySQL connection from db.js
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  db.query(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
    [name, email, password, id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'User deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
