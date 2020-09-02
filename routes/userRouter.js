const express = require("express");
const userValidator = require("../validators/userValidator.js");

const passport = require('passport');

// create router
const userRouter = express.Router();

const userController = require("../controllers/userController");

// Signing up - authenticate newUser, then direct to info form
userRouter.post("/signup", userValidator.addUser, userController.addUser,
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        if(!req.user.bio){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/profile');
        }
    });

// Sign Up form
userRouter.get("/signup", userController.newUserForm);

// Basic Info form
userRouter.get("/signup/form", userController.infoPage);

// Populate info using info form details
userRouter.post("/populateInfo", userController.populateInfo)

// log in form
userRouter.get("/login", userController.logInPage);

// logging in - auth done in route to prevent state loss
userRouter.post("/login", passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        if(!req.user.bio){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/profile');
        }
    });

// google auth
userRouter.get("/auth/google", userController.logInGoogle)

// google auth callback
//userRouter.get("/auth/google/callback", userController.logInGoogleCallback)

// google auth callback -lose state if we go via userController
userRouter.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        if(!req.user.bio){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/profile');
        }
    });

// logging out
userRouter.get("/logout", userController.logOutUser);

module.exports = userRouter;