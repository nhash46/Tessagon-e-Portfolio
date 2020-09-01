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
const addUser = (req, res) => {

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
                        req.flash('success', 'Successful registration! You can now log in');
                        res.redirect('login');
                    }
                });
            });
        });
    }
};

const newUserForm = (req, res) => {
    res.render('signup');
};

const infoPage = (req, res) => {
    res.render('form');
}

// function that loads form page for logging in
const logInPage = (req, res) => {
    res.render('login', {
    });
};

// function to handle a request to login
const logIn = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/profile',
        failureRedirect:'/',
        failureFlash: true

    })(req, res, next);
};

// goggle auth handle
const logInGoogle = (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'] })(req, res, next);
}
// google auth handle callback
const logInGoogleCallback = (req, res, next) => {
    passport.authenticate('google', {
        failureRedirect: '/',
        successRedirect: '/profile'
    })(req, res, next)
}

/*const logInGoogleCallback = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if(err) {
            res.redirect('/');
        }
        if(!user.bio){
            res.send('send user to info page');
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
    newUserForm,
    infoPage,
    logIn,
    logOutUser,
    logInPage,
    logInGoogle,
    logInGoogleCallback,
    authCheck
};