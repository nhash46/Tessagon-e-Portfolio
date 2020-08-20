const mongoose = require("mongoose");
const express = require('express');
const app = express();

// load database
const db = require("./models");
console.log(db);


// GET home page
app.get('/', (req, res) => {
    res.render("index.pug")
});

// routes
const userRouter = require("./routes/userRouter.js");

// user routes handled by userRouter
app.use('/user', userRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('Tessagon is listening on port 3000!')
});

module.exports = app;