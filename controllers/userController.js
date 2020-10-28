const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {validationResult} = require('express-validator');
const { render } = require("pug");

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
const addUser = async (req, res, next) => {

    let usernameTaken = await User.exists({username: req.body.username});
    let emailTaken = await User.exists({email: req.body.email});

    if( usernameTaken || emailTaken ){
        // username is taken
        if(usernameTaken){
            req.session.message = {
                type: 'danger',
                intro: 'That username is already taken!',
                message: 'Try another'
              }
            res.redirect("/user/signup");
            //res.render("signup")
        }
        // email is taken
        if(emailTaken){
            req.session.message = {
                type: 'danger',
                intro: 'That email is already taken!',
                message: 'Try another'
              }
            res.redirect("/user/signup");
            //res.render("signup")
        }
    } else {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,

        });

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.message = {
                type: 'danger',
                intro: "Those passwords didn't match.",
                message: ' Try again.'
              }
            res.redirect("/user/signup");
            //req.flash(errors);
            /**
            res.render('signup',
                {
                    newUser:newUser,
                    errors: errors.mapped()
                });
             */
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
    }

};

const populateInfo = (req, res, next) => {
    // extract info. from body
    //console.log(req.body);
    let user = {};

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.phone_number = req.body.phone_number;
    user.city = req.body.city;
    user.state = req.body.state;
    user.bio = req.body.bio;

    let query = {_id:req.user._id}

    User.updateOne(query, user, function (err) {
        if (err){
            console.log(err);
        }
        else{
            //console.log("saved");
            next();
        }
    });
}

const addTypewriterWords = async (req, res, next) => {

    // checks if there is singular typewriter string or array
    if(!Array.isArray(req.body.typewriter)){
        // if singular then string then push to array
        try {
            let update = {"$push": {"typewriterWords": req.body.typewriter}};
            let query = {_id: req.user._id};
            let user = await User.findOneAndUpdate(query, update, {new: true});
        }
        catch{
            res.status(500);
        }
    } else {
        let lengthList = req.body.typewriter.length;
        // otherwise iterate through req.body.typewriter to store all strings
        for(i = 0; i < lengthList; i++){
            try {
                let update = {"$push": {"typewriterWords": req.body.typewriter[i]}};
                let query = {_id: req.user._id};
                let user = await User.findOneAndUpdate(query, update, {new: true});
            }
            catch{
                res.status(500);
            }
        }
    }
    next();
}

const editHomeInfo = (req,res) => {

    let user = {};

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.typewriterWords = req.body.typewriterWords;
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

    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = req.body.video.match(regExp);
    var id = (match&&match[7].length===11)? match[7]: false;

    let newLink = new Link({
        url: req.body.video,
        thumbnail: 'https://img.youtube.com/vi/'+id+'/hqdefault.jpg',
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

    let links = {
        facebook : req.body.facebook,
        twitter : req.body.twitter,
        github : req.body.github,
        instagram : req.body.instagram,
        linkedIn : req.body.linkedIn
    }

    let user = {
        phone_number : req.body.phone_number,
        city :req.body.city,
        state : req.body.state,
        email : req.body.email,
        links : links
    }

    let query = {_id:req.user._id};

    User.updateOne(query, user, function (err) {
        if (err){
            console.log(err);
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                message: ' Could not save contact information.'
            }
            res.redirect('/user/profile#contact');
        }
        else {
            req.session.message = {
                type: 'success',
                intro: 'Contact information updated!',
                message: ''
            }
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
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                message: ' Could not save about me section.'
            }
            res.redirect('/user/profile#about');
        }
        else {
            req.session.message = {
                type: 'success',
                intro: 'About me section updated!',
                message: ''
            }
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

// redirects to achievement section
const redirectAchievement= (req, res) => {
    res.redirect('/user/profile#portfolio');
}

// redirects to experience section
const redirectExperience = (req, res) => {
    res.redirect('/user/profile#experience');
}

// redirects to portfolio section
const redirectPortfolio = (req, res) => {
    res.redirect('/user/profile#portfolio');
}

// redirects to portfolio section
const redirectSkills = (req, res) => {
    res.redirect('/user/profile#skills');
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
    res.redirect('back');
};


const userID = async (req,res) => {
    

        let exists = await User.exists({username: req.params.username});
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
        .populate('skills')
        .populate('achievement')
        .exec((err,user1) => {
        //console.log(user1);
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
        .populate('skills')
        .populate('achievement')
        .exec((err, user2) => {
            if(user2){
                res.render('index', {
                    user2: user2
                });
            } else {
                res.status(404);
                res.render('error');
            }
    });
};

const deleteMessage = (req, res, next) => {
    delete req.session.message;
    next();
} 

const checkPassword = async (req, res, next) => {
    // Match password
    try {
        bcrypt.compare(req.body.old_password, req.user.password, async (err, isMatch) => {
            if(err) console.log(err);
            if(isMatch){
                next();
            } else {
                req.session.message = {
                    type: 'danger',
                    intro: 'Oops, password entered was incorrect.',
                    message: ' Try again.'
                }
                res.redirect('back');
            }
        });
    } catch (error) {
        req.session.message = {
            type: 'danger',
            intro: 'Oops, password entered was incorrect.',
            message: ' Try again.'
        }
        res.redirect('back');
    }
    
}

const changePassword = async (req, res) => {
    // new passwords match
    if (req.body.new_password == req.body.new_password1) {
        try {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.new_password, salt);
            const userPassword = await User.findByIdAndUpdate({_id:req.user._id}, {password:password}, {new: true});
            req.session.message = {
                type: 'success',
                intro: 'Password updated!',
                message: ''
            }
            res.redirect('back');
        } catch (error) {
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                message: ' Could not change password.'
            }
            res.redirect('back');
        }
    } else {
        req.session.message = {
            type: 'danger',
            intro: 'Oops, the new password you entered did not match.',
            message: ' Try again.'
        }
        res.redirect('back');
    }
}

const getChangePassword = (req, res) => {
    res.render('change-password');
}

const getForgotPassword = (req, res) => {
    res.render('forgot-password');
}

const sendResetPasswordEmail = (req, res, next) => {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                console.log(user);
                if (user == null) {
                    req.session.message = {
                        type: 'info',
                        intro: 'If an account with that email is found, an email with directions will be sent.',
                        message: " If you don't see the email, check other places it might be, like your junk, spam, social or other folders."
                    }
                    res.redirect('/user/forgot-password');
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            
                    user.save(function(err) {
                        done(err, token, user);
                });
                }
            });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'donotreplyprofolio@gmail.com',
            pass: process.env.GMAIL_PW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'hello@profolio.com',
          subject: 'Profolio password reset request',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process within the next hour:\n\n' +
            'http://' + req.headers.host + '/user/reset-password/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail sent');
            done(err, 'done');
        });
      }
    ], function(err) {
        if (err) return next(err);
        req.session.message = {
            type: 'info',
            intro: 'If an account with that email is found, an email with directions will be sent.',
            message: " If you don't see the email, check other places it might be, like your junk, spam, social or other folders."
        }
        res.redirect('/user/forgot-password');
    });
};

const getResetPasswordForm = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.session.message = {
                type: 'danger',
                intro: 'Password reset token is invalid or has expired.',
                message: " Try again."
            }
            res.redirect('/user/forgot-password');
        }
        res.render('reset-password', {token: req.params.token});
    });
};

const resetPassword = (req, res) => {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.session.message = {
                type: 'danger',
                intro: 'Password reset token is invalid or has expired.',
                message: " Try again."
            }
            res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
                req.session.message = {
                    type: 'danger',
                    intro: "Passwords don't match.",
                    message: " Try again."
                }
                res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
              user: 'donotreplyprofolio@gmail.com',
              pass: process.env.GMAIL_PW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'hello@profolio.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            req.session.message = {
                type: 'succuess',
                intro: "Success!",
                message: " Your password has been changed."
            }
          done(err);
        });
      }
    ], function(err) {
        res.redirect('/user/profile');
    });
};
  


module.exports = {
    addUser,
    populateInfo,
    addTypewriterWords,
    newUserForm,
    infoPage,
    logIn,
    logOutUser,
    logInPage,
    logInGoogle,
    logInGoogleCallback,
    authCheck,
    getUserProfile,
    getOtherUserProfile,
    editHomeInfo,
    editNavInfo,
    editAboutMe,
    redirectEducation,
    redirectExperience,
    redirectProfile,
    uploadVideo,
    redirectPortfolio,
    deleteMessage,
    changePassword,
    checkPassword,
    getChangePassword,
    getForgotPassword,
    sendResetPasswordEmail,
    getResetPasswordForm,
    resetPassword,
    redirectSkills,
    redirectAchievement
};