const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// load database
const db = require("./models");
console.log(db);

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// GET home page
app.get('/', (req, res) => {
    res.render("login")
});
// GET home page
app.get('/profile', (req, res) => {
    res.render("index")
});
app.get('/signup', (req, res) => {
    res.render("signup")
});
app.get('/signup/form', (req, res) => {
    res.render("form")
});


// routes
const userRouter = require("./routes/userRouter.js");

// user routes handled by userRouter
app.use('/user', userRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log('Tessagon is listening on port 3000!')
});

module.exports = app;