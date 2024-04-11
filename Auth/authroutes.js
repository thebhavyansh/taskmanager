const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = '220404';

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide name, email, and password" });
    }

    try {
        const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(409).json({ error: "Email is already in use" });
        }

        const [results] = await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
        const userId = results.insertId;

        const token = jwt.sign({ id: userId }, JWT_SECRET);

        res.json({ token });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error during signup" });
    }
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password" });
    }

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ token });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ error: "Internal server error during signin" });
    }
});

module.exports = router;
