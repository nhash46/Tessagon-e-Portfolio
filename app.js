const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
moment = require('moment');
const cors = require('cors');
<<<<<<< Updated upstream
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var busboyBodyParser = require('busboy-body-parser');
=======
>>>>>>> Stashed changes
const app = express();

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// load database
const db = require("./models");
console.log(db);

// use the body-parser middleware, which parses request bodies into req.body
// support parsing of json
app.use(bodyParser.json());

// support parsing of urlencoded bodies (e.g. for forms)
app.use(bodyParser.urlencoded({ extended: false }));

//parse multipart/form-data    
app.use(busboyBodyParser());

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));


// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

// Passport Config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// global user object
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});



// file is name of field in form
/*app.post('/upload', upload.single('file'), (req, res) =>{
    res.json({file: req.file});
});*/

// import userController so can authCheck routes
const userController = require("./controllers/userController");

// GET home page
app.get('/', (req, res) => {
    res.render("login")
});
// GET home page
app.get('/signup', (req, res) => {
    res.render("signup")
});
app.get('/signup/form', userController.authCheck, (req, res) => {
    res.render("form")
});

// routes
const userRouter = require("./routes/userRouter");

// user routes handled by userRouter
app.use('/user', userRouter);

db.connect()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Tessagon is listening on port 3000!')
        });
    })
    .catch((err) => console.log(err));

module.exports = app;