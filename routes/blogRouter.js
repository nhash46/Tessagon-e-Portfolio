const express = require("express");
const blogValidator = require("../validators/blogValidator.js");

// create router
const blogRouter = express.Router();

const blogController = require("../controllers/blogController.js");

// route that retrieves all blogs if there is no query
// upon query, searches for specific blogs
blogRouter.get('/:username', blogController.showBlogs);

// form page for new post
blogRouter.get('/:username/submit', blogController.authCheck, blogController.newBlogForm);

//add post
blogRouter.post('/:username/submit', blogController.addBlog);

//search post by id
blogRouter.get('/:username/:_id',blogController.getBlogByID);

//edit form post by id
blogRouter.get('/:username/edit/:_id', blogController.authCheck, blogController.editBlog);

//update forum post by id
blogRouter.post('/:username/edit/:_id' , blogController.updateBlog);

// delete forum post by id
blogRouter.delete('/:username/:_id', blogController.deleteBlog);

module.exports = blogRouter;