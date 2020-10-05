const express = require("express");

const commentRouter = express.Router();

const commentController = require("../controllers/commentController.js");

// delete comment by id
commentRouter.delete('/:_id', commentController.deleteComment);

// update comment
commentRouter.post("/edit/:_id", commentController.updateComment);

// liked comment
commentRouter.post("/likedComment/:_id", commentController.likedComment);

// unliked comment
commentRouter.post("/unlikeComment/:_id", commentController.unlikeComment);

//comment on particular post
commentRouter.post('/:username/:_id', commentController.addComment);


module.exports = commentRouter;