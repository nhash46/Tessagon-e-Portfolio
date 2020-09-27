const mongoose = require("mongoose");

const Comment = mongoose.model("Comment");
const Blog = mongoose.model("Blog");

const blogController = require("../controllers/blogController");

// adds a comment to comment collection
const addComment = async (req, res) => {

    var newComment = new Comment({
        author : req.user.username,
        content : req.body.content,
        profilePicID : req.user.profilePicID,
        parentPost : req.params._id,
        date: Date.now()
    });

    try {
        const filter = {_id: req.params._id};
        const update = {"$push": {"comments": newComment._id}};
        let blog = await Blog.findOneAndUpdate(filter, update, {new: true});
        console.log(blog.comment);
    } catch(err){
        res.status(400);
        return res.send("Database query failed");
    }

    // add comment to database
    newComment.save(function (err) {
        if (err) return console.error(err);
    });
    res.redirect('/blog-posts/'+req.params.username+'/'+req.params._id);

};

const getAllComments = async (req, res) => {
    try{
        const all_comments = await Comment.find();
        return res.send(all_comments);
    } catch (err) {
        res.status(400);
        return res.send("Database query failed");
    }
};

//gets a comment by parentID
const getCommentByParentId = async (req,res) => {
  try{
      const comment = await Comment.find({'parentPost':req.params._id});
      return res.send(comment);
  } catch(err) {
      res.status(400);
      return res.send("Database query failed");
  }
};

// function to handle request to delete comment
 const deleteComment = (req, res) => {
    // check if user is logged in
    if(!req.user._id){
      res.status(500).send();
    }
    let query = {_id:req.params._id}
  
    // check if user is the author of post
    Comment.findById(query, function(err, comment){
      if(comment.author != req.user.username){
        res.status(500).send();
      } 
      else {
        Comment.remove(query, function(err){
          if(err){
            console.log(err);
          }
          res.send('Success');
        });
      }
    });
  }

module.exports = {
    addComment,
    getAllComments,
    getCommentByParentId,
    deleteComment
};