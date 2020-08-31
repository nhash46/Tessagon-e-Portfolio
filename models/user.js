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
    details: {
        bio: String,
        education: String,
        experience: [
            {type: String}
        ],
        documents: [
            {type: Schema.Types.Mixed}
        ],
    }
});

userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;