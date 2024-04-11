const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const db = require('../db'); // Import the MySQL connection from db.js
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// API endpoints
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // In a real-world scenario, you'd check the credentials against a database
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0 && results[0].password === password) {
      const token = jwt.sign({ email: results[0].email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  });
});

// Create a task
app.post('/tasks', verifyToken, (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.email; // Assuming the email is the user's ID

  const task = { title, description, user_id: userId };

  db.query('INSERT INTO tasks SET ?', task, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Task created successfully', task });
  });
});

// Update a task
app.put('/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  db.query(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    [title, description, id],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Task updated successfully' });
    }
  );
});

// Delete a task
app.delete('/tasks/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tasks WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Task deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
