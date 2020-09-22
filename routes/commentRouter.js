const express = require("express");

const commentRouter = express.Router();

const commentController = require("../controllers/commentController.js");

//comment on particular post
commentRouter.post('/:_id', commentController.addComment);

module.exports = commentRouter;