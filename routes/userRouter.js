const express = require("express");

// create router
const userRouter = express.Router();

const userController = require("../controllers/userController");

// Signing up
userRouter.post("/signup", userController.addUser);

// Sign Up form
userRouter.get("/signup", userController.newUserForm);

// log in form
userRouter.get("/login", userController.logInPage);

// logging in
userRouter.post("/login", userController.logIn);

// logging out
userRouter.get("/logout", userController.logOutUser);

module.exports = userRouter;