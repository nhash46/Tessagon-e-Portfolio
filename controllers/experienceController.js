const mongoose = require("mongoose");

const Experience = mongoose.model("Experience");
const User = mongoose.model("User");

// adds a comment to comment collection
const addExperience = async (req, res, next) => {

    var newExperience = new Experience({
        user: req.user._id,  
        company : req.body.company,
        role : req.body.role,
        experienceStartDate : req.body.experienceStartDate,
        experienceEndDate : req.body.experienceEndDate
    })

    // need to add this Id to Parent document 'comment' field 
    try{
        const filter = { _id: req.user._id};
        const update = { "$push" : {"experience" : newExperience._id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.experience);
    } catch(err){
        res.status(400);
        return res.send("Database query failed");
    }

    // add comment to database
    newExperience.save(function (err) {
      if (err) {
          res.status(400);
          return console.error(err);
      } else {
          next();
      }
    });
  };

const editExperience = (req,res, next) => {

    let experience = {};
    
    experience.company = req.body.company;
    experience.role = req.body.role;
    experience.experienceStartDate = req.body.experienceStartDate;
    experience.experienceEndDate = req.body.experienceEndDate;
    
    let query = {_id:req.params._id}
  
    // add post into db
    Experience.updateOne(query, experience, function (err) {
      if (err){
        console.log(err);
        res.status(400);
      }
      else{
        next();
      } 
    });

};

module.exports = {
    addExperience,
    editExperience
};