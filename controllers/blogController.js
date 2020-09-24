const mongoose = require("mongoose");
const {validationResult} = require('express-validator');

// imprt blog model
const Blog = mongoose.model("Blog");

// import comment model
const Comment = mongoose.model("Comment");

// import user model
const User = mongoose.model("User");

// function to handle request to add

const addBlog = (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        //TODO change to add_blog
        res.render('add_blog',
            {
                title: 'Create a post',
                errors: errors.mapped()
            });
    } else {
        // extract info. from body
        var newPost = new Blog({
            title: req.body.title,
            author: req.user.username,
            body: req.body.body,
            date: Date.now()
        });

        // add post into db
        newPost.save(function (err) {
            if (err){
                console.log(err);
            }
            else{
                //TODO change to blog-posts
                res.redirect('/blog-posts');
            }
        });
    }
};
/*const addBlog = (req, res) => {
    //let errors = validationResult(req);
    //may need to add validation here

    // extract info from body
    var newPost = new Blog({
        title: req.body.title,
        author: req.user.username,
        body: req.body.body,
        date: Date.now()
    });

    newPost.save(function (err) {
        if (err){
            console.log(err);
        } else {
            //TODO change name to blog-posts
            res.redirect('/blog-posts');
        }
    });
};
 */

// function that loads form page for adding post
const newBlogForm = (req, res) => {
    res.render('add_blog', {
        title:'Create a post',
    });
}


// function to handle a request to get all blogs
const getAllBlogPosts = async (req, res) => {

    Blog.find({}, function(err, blogs){

        if(err){
            console.log(err);
        } else {
            res.render("blog-posts", {
                title: 'Blogs',
                blogs: blogs
            });
        }
    });
};

// function to search for forums upon query
const showBlogs = (req, res) => {
    const searchQuery = null;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all blogs from DB
        Blog.find({title: regex}, function(err, allBlogs){
            if(err){
                console.log(err);
            } else {
                if(allBlogs.length < 1) {
                    noMatch = true;

                }
                res.render("blog-posts",
                    {
                        title: 'Blog',
                        searchQuery: req.query.search,
                        blogs: allBlogs,
                        noMatch: noMatch
                    });
            }
        });
    } else {
        // Get all blogs from DB
        Blog.find({}, function(err, allBlogs){
            if(err){
                console.log(err);
            } else {
                res.render("blog-posts",
                    {
                        blogs: allBlogs,
                        noMatch: noMatch
                    });
            }
        });
    }
};

// function to handle a request to a particular blog
const getBlogByID = async (req, res) => {

    Blog.findById(req.params._id).populate('comments').exec(function(err, blog){

        //TODO change to view_blog
        res.render('view_blog', {
            blog: blog
        });
    });
};

// access control
/*
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/user/login')
    }
}

 */


// backend function involved in updating a posts comment field upon adding a Comment. See commentController addComment().
var getBlogByIDComment = async (req, res) => {

    try {
        const post = await Blog.find({'_id': req.params._id});
    } catch (err) {
        return console.error(err);
    }
};

// gets a comment by parentId

const getCommentByParentId = async (req, res) => {
    try{
        const comment = await Comment.find({'parentPost': req.params._id});

        return res.send(comment);
    }
    catch(err) {
        res.status(400);
        return res.send("Database query failed");
    }
};

// Load Edit Form
const editBlog = async (req, res) => {

    Blog.findById(req.params._id, function(err, blog){
        if(blog.author != req.user.username){
            //req.flash('danger', 'Not authorised to edit this post');
            res.redirect('/blog-posts');
        }
        else {
            res.render('edit_blog', {
                title: 'Edit Blog',
                blog: blog
            });
        }
    });
};

// function to handle request to edit post
const updateBlog = (req, res) => {
    // extract info. from body

    let blog = {};

    blog.title = req.body.title;
    blog.body = req.body.body;

    let query = {_id:req.params._id};

    // add post into db
    Blog.updateOne(query, blog, function (err) {
        if (err){
            console.log(err);
        }
        else{
            //req.flash('success','Post Updated');
            res.redirect('/blog-posts');
        }
    });
};

// function to handle request to delete post
const deleteBlog = (req, res) => {
    // check if user is logged in
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params._id}

    // check if user is the author of post
    Blog.findById(query, function(err, blog){
        if(blog.author != req.user.username){
            res.status(500).send();
        }
        else {
            Blog.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                //req.flash('success','Post Deleted');
                res.send('Success');
            });
        }
    });
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// remember to export the functions
module.exports = {
    getAllBlogPosts,
    addBlog,
    getBlogByID,
    getBlogByIDComment,
    newBlogForm,
    getCommentByParentId,
    editBlog,
    updateBlog,
    deleteBlog,
    //ensureAuthenticated,
    showBlogs
};
