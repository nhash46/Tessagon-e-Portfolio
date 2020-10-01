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
        experienceEndDate : req.body.experienceEndDate,
        description: req.body.description
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

const editExperience = (req,res) => {

    let experience = {};
    
    experience.company = req.body.company;
    experience.role = req.body.role;
    experience.experienceStartDate = req.body.experienceStartDate;
    experience.experienceEndDate = req.body.experienceEndDate;
    experience.description = req.body.description;
    
    let query = {_id:req.params._id}
  
    // add post into db
    Experience.updateOne(query, experience, function (err) {
      if (err){
        console.log(err);
        res.status(400);
      }
      else{
          res.send('Success')
      } 
    });

};

const deleteExperience = (req, res) => {
  // check if user is logged in
  if(!req.user){
    console.log('user not logged in!');
    res.status(500).send();
  }

  let query = {_id:req.params._id}

  // check if experience object belongs to user
  Experience.findById(query, function(err, experience){
    if(experience.user.toString() != req.user._id.toString()){
      console.log('experience user _id: ' + experience.user._id);
      console.log('global user _id:     ' + req.user._id);
      console.log('_id not found!');
      res.status(500).send();
    } 
    else {
      Experience.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success')

      });
    }
  });
}

module.exports = {
    addExperience,
    editExperience,
    deleteExperience
};