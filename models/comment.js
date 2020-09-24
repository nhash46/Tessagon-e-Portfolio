const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    author: {type: String},
    content: {type: String},
    parentPost : {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    date: {type:Date, default: Date.now}
});

const Comment = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comment;