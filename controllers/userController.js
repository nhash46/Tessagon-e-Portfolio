const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const {validationResult} = require('express-validator');

// import user model
const User = mongoose.model("User");
const Document = mongoose.model("Document");
const Link = mongoose.model("Link");

const authCheck = (req, res, next) => {
    if(!req.user){
        // if user not logged in
        res.redirect('/');
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

const populateInfo = (req, res, next) => {
    // extract info. from body
    console.log(req.body);
    let user = {};

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
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
            console.log("saved");
            next();
        }
    });
}

const editHomeInfo = (req,res) => {

    let user = {};

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    // need to be able to edit photo

    let query = {_id:req.user._id};

    User.updateOne(query, user, function (err) {
       if (err){
           console.log(err);
       }
       else {
           console.log("edited home page");
           res.redirect('/user/profile');
       }
    });

};


const uploadVideo = async (req,res,next) => {

    let newLink = new Link({
        url: req.body.video,
        title: req.body.title,
        subheading: req.body.subheading,
        user: req.user._id,
    });
    console.log(newLink);

    try {
        const filter = { _id: req.user._id};
        const update = { "$push" : {"youtubeLinks" : newLink._id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.youtubeLinks);
    } catch(err){
        res.status(400);
        return res.send("Databse query failed");
    }

    await newLink.save(function (err) {
        if (err) {
            res.status(400);
            return console.error(err);
        } else {
            next();
        }
    });

};

const editNavInfo = (req,res) => {


    let user = {};

    user.phone_number = req.body.phone_number;
    user.city = req.body.city;
    user.state = req.body.state;
    user.email = req.body.email;

    let query = {_id:req.user._id};

    User.updateOne(query, user, function (err) {
        if (err){
            console.log(err);
        }
        else {
            console.log("edited account details");
            res.redirect('/user/profile#contact');
        }
    });
};

const editAboutMe = (req,res,next) => {

    let user = {};

    user.bio = req.body.bio;

    let query = {_id:req.user._id};

    User.updateOne(query, user, function (err) {
        if (err){
            console.log(err);
        }
        else {
            console.log("edited about me");
            res.redirect('/user/profile#about');
            //next();
        }
    });

};

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

// redirects to profile page
const redirectProfile = (req, res) => {
    res.redirect('/user/profile');
}

// redirects to education section
const redirectEducation = (req, res) => {
    res.redirect('/user/profile#education');
}

// redirects to experience section
const redirectExperience = (req, res) => {
    res.redirect('/user/profile#experience');
}

// function to handle a request to login - NOT IN USE
const logIn = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }),
        function(req, res) {
            if(!req.user.first_name){
                res.redirect('/signup/form/');
            } else {
                res.redirect('/user/profile');
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
            if(!req.user.state){
                res.redirect('/signup/form/');
            } else {
                res.redirect('/user/profile');
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


const userID = async (req,res) => {
    

        var exists = await User.exists({username: req.params.username});
        // Ensures that the user exists
        if (!exists) {
            res.render('/', {
                message:"Invalid user profile"
            });
        } else {
            // Finds the relevant user within the database
            User.findOne({username:req.params.username}, async function (err, user) {
                return res.render('index', {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    bio: user.bio,
                    city: user.city,
                    state: user.state,
                    phone: user.phone,
                    education: user.education,
                    experience: user.experience,
                    links: user.links,
                    youtubeLinks: user.youtubeLinks,
                    documents: user.documents,
                    educationStartDate: user.educationStartDate,
                    degree: user.education

                })
            });
        }
    };

// function that renders the user profile
const getUserProfile = async (req, res) => {
    User.findById(req.user._id)
        .populate('education')
        .populate('experience')
        .populate('document')
        .populate('profilePicID')
        .populate('backgroundPicID')
        .populate('resumeID')
        .populate('youtubeLinks')
        .exec((err,user1) => {
        console.log(user1);
        res.render('profile', {
            user1: user1
        });
    });
};

const getOtherUserProfile = async (req, res) => {
    User.findOne({username:req.params.username})
        .populate('education')
        .populate('experience')
        .populate('document')
        .populate("profilePicID")
        .populate('backgroundPicID')
        .populate('resumeID')
        .populate('youtubeLinks')
        .exec((err, user2) => {
        console.log(user2);
        res.render('index', {
            user2: user2
        });
    });
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
    authCheck,
    userID,
    getUserProfile,
    getOtherUserProfile,
    editHomeInfo,
    editNavInfo,
    editAboutMe,
    redirectEducation,
    redirectExperience,
    redirectProfile,
    uploadVideo
};