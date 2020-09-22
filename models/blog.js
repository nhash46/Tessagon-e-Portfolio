const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    body: {type: String, required: true},
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    date: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema, "blog");

module.exports = Blog;