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
    youtubeLinks: [{type: Schema.Types.ObjectId, ref: "Link"}],
    profilePicID: {type: Schema.Types.ObjectId, ref: "Document"},
    backgroundPicID: {type: Schema.Types.ObjectId, ref: "Document"},
    resumeID : {type: Schema.Types.ObjectId, ref: "Document"},
    //links: {type: Schema.Types.ObjectId, ref: "Links"},
    education: [{type: Schema.Types.ObjectId, ref: "Education"}],
    experience: [{type: Schema.Types.ObjectId, ref: "Experience"}],
    document: [ {type: Schema.Types.ObjectId, ref: "Document"}],
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;