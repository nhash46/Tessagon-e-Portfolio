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

const editExperience = (req,res,next) => {
    let exp = {_id:req.experience._id};

    exp.company = req.body.company;
    exp.role = req.body.role;
    exp.experienceStartDate = req.body.experienceStartDate;
    exp.experienceEndDate = req.body.experienceEndDate;

    try{
        const filter = { _id: req.user._id};
        const update = { "$push" : {"experience" : exp._id}};
        //new might be false depending on implimentation
        let user = User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.experience);
    } catch(err){
        res.status(400);
        return res.send("Database query failed");
    }

    exp.save(function (err) {
        if (err) {
            res.status(400);
            return console.error(err);
        } else {
            next();
        }
    });

};

module.exports = {
    addExperience,
    editExperience
};