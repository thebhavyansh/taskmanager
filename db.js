const mysql = require('mysql2');
const dotenv = require('dotenv');


const db = mysql.createConnection({
  host: "localhost",
  user:"root",
  password: "123456",
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL server!');

    db.query("CREATE DATABASE IF NOT EXISTS Task", (err, result) => {
        if (err) throw err;
        console.log("Database 'Task' created successfully!");
    });

    db.query("USE Task", (err, result) => {
        if (err) throw err;
        console.log("Switched to database 'Task'");
    });

    db.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL ,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )`, (err, result) => {
        if (err) throw err;
        console.log('Users table created successfully!');
    });

  
    db.query(`CREATE TABLE IF NOT EXISTS Tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err, result) => {
        if (err) throw err;
        console.log('Blogs table created successfully!');
    });
});

module.exports = db;
