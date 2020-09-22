const express = require("express");
// const forumValidator = require("../validators/forumValidator.js");

// create router
const blogRouter = express.Router();

const blogController = require("../controllers/blogController.js");

// route that retrieves all forums if there is no query
// upon query, searches for specific forums
// forumRouter.get('/', forumController.showForums);

// form page for new post
// forumRouter.get('/submit', forumController.newForumForm);

//add post 
forumRouter.post('/submit', blogController.addBlog);


module.exports = blogRouter;