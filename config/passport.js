const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const google = require('./google');

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
            callbackURL: "https://tessagon-e-portfolio.herokuapp.com/user/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            console.log("inside cb");
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (err) {
                    return cb(err);
                }
                //No user was found... so create a new user with values from Google (all the profile. stuff)
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'google',
                        //now in the future searching on User.findOne({'google.id': profile.id } will match because of this next line
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return cb(err, user);
                    });
                } else {
                    //found user. Return
                    return cb(err, user);
                }
            });
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