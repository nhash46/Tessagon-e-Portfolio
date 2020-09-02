const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const {validationResult} = require('express-validator');

// import user model
const User = mongoose.model("User");

const authCheck = (req, res, next) => {
    if(!req.user){
        // if user not logged in
        res.redirect('/')
    } else {
        next();
    }
}
// function to add user
const addUser = (req, res, next) => {

    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,

    });

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash(errors);
        res.render('signup',
            {
                newUser:newUser,
                errors: errors.mapped()
            });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;

                // add user to database
                newUser.save((err) => {
                    if (err) {
                        console.log(err);

                    } else {
                        next();
                    }
                });
            });
        });
    }
};

const populateInfo = (req, res) => {
    // extract info. from body

    let user = {};

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.phone_number = req.body.number;
    user.city = req.body.city;
    user.state = req.body.state;
    user.bio = req.body.bio;

    let query = {_id:req.user._id}


    User.updateOne(query, user, function (err) {
    if (err){
        console.log(err);
    }
    else{
        req.flash('success','details saved');
        res.redirect('/profile');
    }
    });
}

const newUserForm = (req, res) => {
    res.render('signup');
};

const infoPage = (req, res) => {
    //console.log(req.query.user);
    res.render('form', {
        //username: req.query.user.username
    });
}

// function that loads form page for logging in
const logInPage = (req, res) => {
    res.render('login', {
    });
};

// function to handle a request to login - NOT IN USE
const logIn = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            if(!req.user.bio){
                res.redirect('/signup/form/');
            } else {
                res.redirect('/profile');
            }
        }(req, res, next);
};

// goggle auth handle
const logInGoogle = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'] })(req, res, next);
}
// google auth handle callback - doesn't keep user state - NOT IN USE
const logInGoogleCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            if(!req.user.bio){
                res.redirect('/signup/form/');
            } else {
                res.redirect('/profile');
            }
        }(req, res, next)
}

/*const logInGoogleCallback = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        console.log(user);
        if(err) {
            res.redirect('/');
        }
        if(!user.bio){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/profile');
        }
    })(req,res,next)
}*/

// log out the current user
const logOutUser = (req, res) => {
    req.logout();
    // req.flash('success', 'You have successfully logged out. Come back soon!');
    res.redirect('/');
};

module.exports = {
    addUser,
    populateInfo,
    newUserForm,
    infoPage,
    logIn,
    logOutUser,
    logInPage,
    logInGoogle,
    logInGoogleCallback,
    authCheck
};