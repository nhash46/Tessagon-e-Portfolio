const express = require("express");
const mongoose = require("mongoose");
const userValidator = require("../validators/userValidator.js");

const passport = require('passport');

// create router
const userRouter = express.Router();

const userController = require("../controllers/userController");
const educationController = require("../controllers/educationController.js");
const experienceController = require("../controllers/experienceController.js");
const uploadController = require("../controllers/uploadController");
const skillController = require("../controllers/skillController");

const db = require("../models");
const blogController = require("../controllers/blogController.js");

// Signing up - authenticate newUser, then direct to info form
userRouter.post("/signup", userValidator.addUser, userController.addUser,
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        if(!req.user.bio){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/user/profile');
        }
    });

// Lod Upload form
userRouter.get("/upload", (req, res) => {
    res.render('upload');
});

// Upload form
userRouter.post("/upload", 
    uploadController.upload.single('file'),
    uploadController.uploadDocument,
    userController.redirectPortfolio
    );

// Upload form
userRouter.post("/uploadPic",
    uploadController.upload.single('file'),
    uploadController.uploadBackgroundPic,
    userController.redirectPortfolio
);
userRouter.post("/uploadVid", userController.uploadVideo, userController.redirectProfile);

// GET files by userID
userRouter.get("/files", uploadController.getFilesByID);

// GET file by userID and ID
userRouter.get("/images/:id", uploadController.getFileByID);

// GET file by userID and Filename
userRouter.get("/image/:filename", uploadController.getImageByFilename);

// GET document by filename
userRouter.get("/document/:filename", uploadController.getDocumentByFilename);

// GET resume by filename
userRouter.get("/resume/:filename", uploadController.getResumeByFilename);

// DELETE document by filename
userRouter.delete("/document/:_id", uploadController.deleteDocument);

// Sign Up form
userRouter.get("/signup", userController.newUserForm);

// Basic Info form
userRouter.get("/signup/form", userController.authCheck, userController.infoPage);

// Populate info using info form details
userRouter.post("/populateInfo", 
    uploadController.upload.fields([{
        name: 'resume', maxCount: 1
    }, {
        name: 'propic', maxCount: 1
    }]),
    uploadController.uploadResume,
    uploadController.uploadProfilePic,
    userController.populateInfo,
    userController.addTypewriterWords,
    experienceController.addExperience, 
    educationController.addEducation,
    skillController.addSkill,
    userController.deleteMessage,
    userController.redirectProfile
);

// Adds new experience object to user
userRouter.post("/addExperience", experienceController.addExperience, userController.redirectExperience);

// Adds new experience object to user
userRouter.post("/addEducation", educationController.addEducation, userController.redirectEducation);

// Edit info nav bar
userRouter.post("/editNavInfo", userController.editNavInfo);

// Edit info on the home page
userRouter.post("/editHomeInfo",
    userController.authCheck,
    uploadController.upload.single('background'),
    uploadController.uploadBackgroundPic,
    userController.editHomeInfo
);

// Edit about me
userRouter.post("/editAboutMe",
    userController.authCheck,
    uploadController.upload.fields([{
            name: 'resume', maxCount: 1
        }, {
            name: 'propic', maxCount: 1
        }]),
    uploadController.uploadResume,
    uploadController.uploadProfilePic,
    userController.editAboutMe
    );

// Edit education
userRouter.post("/editEducation/:_id", educationController.editEducation, userController.redirectEducation);

// Edit experience
userRouter.post("/editExperience/:_id", experienceController.editExperience, userController.redirectExperience);

// log in form Home
userRouter.get("/login", userController.logInPage);

// logging in - auth done in route to prevent state loss
userRouter.post("/login", passport.authenticate('local', { failureRedirect: '/' }),
    function(req, res) {
        if(!req.user.state){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/user/profile');
        }
    });

// google auth
userRouter.get("/auth/google", userController.logInGoogle)

// google auth callback
//userRouter.get("/auth/google/callback", userController.logInGoogleCallback)

// google auth callback -lose state if we go via userController
userRouter.get("/auth/google/callback",
    passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        if(!req.user.state){
            res.redirect('/signup/form/');
        } else {
            res.redirect('/user/profile');
        }
    });

// logging out
userRouter.get("/logout", userController.logOutUser);

// loads another user's profile
userRouter.get("/profile/:username", userController.getOtherUserProfile);

// load global user's profile
userRouter.get('/profile', userController.authCheck, userController.getUserProfile);

// delete experience object
userRouter.delete('/experience/:_id', experienceController.deleteExperience);

// delete education object
userRouter.delete('/education/:_id', educationController.deleteEducation);

// change password
userRouter.get('/change-password', userController.getChangePassword);
userRouter.post('/change-password', userController.authCheck, userController.checkPassword, userController.changePassword);


module.exports = userRouter;