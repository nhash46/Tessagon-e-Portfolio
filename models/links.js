const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new mongoose.Schema({
    url: String,
    title: String,
    subheading: String,
    thumbnail: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Link = mongoose.model("Link", linkSchema, "links");

module.exports = Link;