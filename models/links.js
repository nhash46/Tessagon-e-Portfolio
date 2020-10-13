const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    facebook: String,
    twitter: String,
    dribble: String,
    github: String,
    instagram: String,
    linkedIn: String
});

const Links = mongoose.model("Links", linkSchema, "links");

module.exports = Links;