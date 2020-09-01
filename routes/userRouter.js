const express = require("express");
const userValidator = require("../validators/userValidator.js");

const passport = require('passport');

// create router
const userRouter = express.Router();

const userController = require("../controllers/userController");

// Signing up
userRouter.post("/signup", userValidator.addUser, userController.addUser);

// Sign Up form
userRouter.get("/signup", userController.newUserForm);

// Info Form
userRouter.get("/info", userController.infoPage);

// Populate info using info form details
userRouter.get("/populateInfo", userController.populateInfo)

// log in form
userRouter.get("/login", userController.logInPage);

// logging in
userRouter.post("/login", userController.logIn);

// google auth
userRouter.get("/auth/google", userController.logInGoogle)

// google auth callback
userRouter.get("/auth/google/callback", userController.logInGoogleCallback)

// logging out
userRouter.get("/logout", userController.logOutUser);

module.exports = userRouter;