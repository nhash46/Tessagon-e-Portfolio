const mongoose = require("mongoose");

const Experience = mongoose.model("Experience");
const User = mongoose.model("User");

// adds a comment to comment collection
const addExperience = async (req, res, next) => {

    var newExperience1 = new Experience({
        user: req.user._id,  
        company : req.body.company1,
        role : req.body.role1,
        experienceStartDate : req.body.experienceStartDate1,
        experienceEndDate : req.body.experienceEndDate1
    })

    var newExperience2 = new Experience({
      user: req.user._id,  
      company : req.body.company2,
      role : req.body.role2,
      experienceStartDate : req.body.experienceStartDate2,
      experienceEndDate : req.body.experienceEndDate2
    })

    var newExperience3 = new Experience({
    user: req.user._id,  
    company : req.body.company3,
    role : req.body.role3,
    experienceStartDate : req.body.experienceStartDate3,
    experienceEndDate : req.body.experienceEndDate3
    })

    experiences = [newExperience1, newExperience2, newExperience3]; 

    Experience.collection.insertMany(experiences, function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });

    /**
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
     */
  };

const editExperience = (req,res) => {

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
        res.redirect('/user/profile#experience');
      } 
    });

};

module.exports = {
    addExperience,
    editExperience
};