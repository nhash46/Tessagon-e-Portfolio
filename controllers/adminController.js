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
const Report = mongoose.model("Report");

// function to search for Users upon query
const searchAllUsers = (req, res) => {
    const searchQuery = null;
    let noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all blogs from DB
        User.find({username: regex}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                if(allUsers.length < 1) {
                    noMatch = true;

                }
                res.render("admin",
                    {
                        title: 'Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    } else {
        // Get all blogs from DB
        User.find({}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                res.render("admin",
                    {
                        title: 'Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    }
};

// function to search for Users upon query
const searchReportedUsers = (req, res) => {
    const searchQuery = null;
    let noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all blogs from DB
        User.find({username: regex, isReported: true}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                if(allUsers.length < 1) {
                    noMatch = true;

                }
                res.render("admin",
                    {
                        title: 'Reported Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    } else {
        // Get all blogs from DB
        User.find({isReported: true}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                res.render("admin",
                    {
                        title: 'Reported Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    }
};

// function to search for Users upon query
const searchBannedUsers = (req, res) => {
    const searchQuery = null;
    let noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all blogs from DB
        User.find({username: regex, isBanned: true}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                if(allUsers.length < 1) {
                    noMatch = true;

                }
                res.render("admin",
                    {
                        title: 'Banned Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    } else {
        // Get all blogs from DB
        User.find({isBanned: true}, function(err, allUsers){
            if(err){
                console.log(err);
            } else {
                res.render("admin",
                    {
                        title: 'Banned Users',
                        searchQuery: req.query.search,
                        users: allUsers,
                        noMatch: noMatch,
                    });
            }
        });
    }
};

const banUser = (req, res) => {

    let user = {};

    user.isBanned = true;

    let query = {_id:req.params._id};

    // add post into db
    User.updateOne(query, user, function (err) {
        if (err){
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                messages: ' User could not be banned.'
            }
            console.log(err);
            res.redirect('back');
        }
        else{
            //req.flash('success','Post Updated');
            req.session.message = {
                type: 'success',
                intro: 'User successfully banned.'
            }
            res.redirect('back');
        }
    });
}

const unbanUser = (req, res) => {

    let user = {};

    user.isBanned = false;

    let query = {_id:req.params._id};

    // add post into db
    User.updateOne(query, user, function (err) {
        if (err){
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                messages: ' User could not be unbanned.'
            }
            console.log(err);
            res.redirect('back');
        }
        else{
            //req.flash('success','Post Updated');
            req.session.message = {
                type: 'success',
                intro: 'User successfully unbanned.'
            }
            res.redirect('back');
        }
    });
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = {
    searchAllUsers,
    searchReportedUsers,
    searchBannedUsers,
    banUser,
    unbanUser
};