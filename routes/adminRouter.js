const express = require("express");
const mongoose = require("mongoose");
const adminRouter = express.Router();
const passport = require('passport');
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const reportController = require("../controllers/reportController.js");

adminRouter.get("/", userController.authCheck, adminController.searchAllUsers);

adminRouter.get("/reported", userController.authCheck, adminController.searchReportedUsers);

adminRouter.get("/banned", userController.authCheck, adminController.searchBannedUsers);

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

adminRouter.post("/ban/:_id", userController.authCheck, adminController.banUser);

adminRouter.post("/unban/:_id", userController.authCheck, adminController.unbanUser);

adminRouter.post("/unreport/:_id", userController.authCheck, adminController.unreportUser);

adminRouter.post("/report/:_commentid/:_harassinguser", userController.authCheck, reportController.newReport);

adminRouter.get("/logout", userController.logOutUser);

module.exports = adminRouter;