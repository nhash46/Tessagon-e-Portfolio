const express = require("express");
const blogValidator = require("../validators/blogValidator.js");

// create router
const blogRouter = express.Router();

const blogController = require("../controllers/blogController.js");

// route that retrieves all blogs if there is no query
// upon query, searches for specific blogs
blogRouter.get('/', blogController.showBlogs);

// form page for new post
blogRouter.get('/submit', blogController.newBlogForm);

//add post
blogRouter.post('/submit', blogController.addBlog);

//search post by id
blogRouter.get('/:_id',blogController.getBlogByID);

//edit form post by id
blogRouter.get('/edit/:_id', blogController.editBlog);

//update forum post by id
blogRouter.post('/edit/:_id' , blogController.updateBlog);

// delete forum post by id
blogRouter.delete('/:_id', blogController.deleteBlog);

module.exports = blogRouter;