const mongoose = require("mongoose");
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true},
    googleId: String,
    password: String,
    password2: String,
    first_name: String,
    last_name: String,
    email: {type: String, unique: true},
    bio: String,
    city: String,
    state: String,
    phone_number: String,
    links: 
        { 
            facebook: String,
            twitter: String,
            dribble: String,
            github: String,
            instagram: String,
            linkedIn: String
        },
    education: [{type: Schema.Types.ObjectId, ref: "Education"}],
    experience: [{type: Schema.Types.ObjectId, ref: "Experience"}],
    documents: [ {type: Schema.Types.Mixed} ],
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;