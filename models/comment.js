const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    author: {type: String},
    content: {type: String},
    profilePicID: {type: Schema.Types.ObjectId, ref: "Document"},
    parentPost : {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    date: {type:Date, default: Date.now},
    likedUsers: [ {type: Schema.Types.ObjectId, ref: "User"}],
    numberOfLikes: {type: Number, default: 0}
});

const Comment = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comment;