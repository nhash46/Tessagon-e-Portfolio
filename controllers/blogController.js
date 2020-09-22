const mongoose = require = require("mongoose");
const {validationResult} = require('express-validator/check');

// imprt forum model
const Forum = mongoose.model("Post");

// import comment model
const Comment = mongoose.model("Comment");

// import user model
const User = mongoose.model("User");

// function to handle request to add
const addBlog = (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        res.render('add_blog', {
            title: 'Create a post',
            errors: errors.mapped()
        });
    } else {
        // extract info from body
        var newPost = new Blog({
            title: req.body.title,
            author: req.user.username,
            body: req.body.body,
            date: Date.now()
        });
    }
};