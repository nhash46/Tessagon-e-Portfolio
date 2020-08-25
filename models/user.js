const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, unique: true},
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

const User = mongoose.model("User", userSchema, "users");

module.exports = User;