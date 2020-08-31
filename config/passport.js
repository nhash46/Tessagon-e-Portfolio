const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const google = require('./google');
let user = {};

module.exports = (passport) => {
    // Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        // Match username
        let query = {username:username};
        User.findOne(query, (err, user) => {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found'})
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user, {message: 'Successful sign in'});
                } else {
                    return done(null, false, {message: 'Wrong password'})
                }
            });
        });
    }));

    passport.use(new GoogleStrategy({
            clientID: google.GOOGLE.client_id,
            clientSecret: google.GOOGLE.client_secret,
            callbackURL: "https://tessagon-dan.herokuapp.com/user/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            user = { ...profile };
            console.log(user);
            return cb(null, profile);
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}