const express = require("express");
const mongoose = require("mongoose");
const userValidator = require("../validators/userValidator.js");
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');
const passport = require('passport');

const User = mongoose.model("User");
const Document = mongoose.model("Document");

// create router
const userRouter = express.Router();

const userController = require("../controllers/userController");
const educationController = require("../controllers/educationController.js");
const experienceController = require("../controllers/experienceController.js");
const uploadController = require("../controllers/uploadController");

const db = require("../models")
const storage = new GridFsStorage({
    url: db.MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    // ref to parent user
                    user: req.user._id,
                    filename: filename,
                    // the name of the document collection
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

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
userRouter.post("/upload", upload.single('file'), async (req, res) => {

    // req.file to access the file
    //console.log(req.file);
    //res.json({file: req.file});
    console.log(req.file);
    try {
        // add the user id reference
        let doc = await Document.findById({_id: req.file.id})
        doc.user = req.user._id;
        console.log(doc);
        doc.save();
        console.log('saved, now referecne');
        // add the file id reference to the user
        const filter = { _id: req.user._id};
        const update = { "$push" : {"document" : req.file.id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.document);

        res.redirect('/user/profile');
    } catch(err) {
        res.status(400);
        return res.send("Didn't work dumbass");
    }
});
// Sign Up form
userRouter.get("/signup", userController.newUserForm);

// Basic Info form
userRouter.get("/signup/form", userController.authCheck, userController.infoPage);

// Populate info using info form details
userRouter.post("/populateInfo", userController.populateInfo, experienceController.addExperience, educationController.addEducation);

// Edit info nav bar
userRouter.post("/editNavInfo", userController.editNavInfo);

// Edit info on the home page
userRouter.post("/editHomeInfo", userController.editHomeInfo);

// Edit about me
userRouter.post("/editAboutMe", userController.editAboutMe);

// Edit education
userRouter.post("/editEducation/:_id", educationController.editEducation);

// Edit experience
userRouter.post("/editExperience/:_id", experienceController.editExperience);

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


module.exports = userRouter;