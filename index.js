const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

const Auth = require('./Auth/authroutes');
const Task = require('./Auth/task');
const User = require('./Auth/userroutes');
app.use("/auth",Auth);
app.use('/task',Task);
app.use("/user",User);
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
module.exports = app;
