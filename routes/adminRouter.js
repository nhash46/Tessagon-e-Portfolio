const express = require("express");
const mongoose = require("mongoose");
const adminRouter = express.Router();
const passport = require('passport');
//const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");

adminRouter.get("/", userController.authCheck, (req, res) => {
    res.render('admin');
});

adminRouter.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (user.isAdmin) {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/admin');
            });
        }
        else {
            req.session.message = {
                type: 'danger',
                intro: 'Oops,',
                message: ' you do not have administrative rights.'
            }
            res.redirect('back'); 
        }
    })(req, res, next);
});

module.exports = adminRouter;