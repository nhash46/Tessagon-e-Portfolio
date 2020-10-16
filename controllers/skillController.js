const mongoose = require("mongoose");

const Skill = mongoose.model("Skill");
const User = mongoose.model("User");

// save skill to user and add skill collection
const addSkill = async (req, res, next) => {

    if(!Array.isArray(req.body.skills)){
      let newSkill = new Skill({
        user: req.user._id,
        name: req.body.skillName,
        description: req.body.description
      })

      // need to add this Id to Parent document 'comment' field
      try {
          const filter = {_id: req.user._id};
          const update = {"$push": {"skills": newSkill._id}};
          let user = await User.findOneAndUpdate(filter, update, {new: true});
          console.log(user.skills);
      } catch (err) {
          res.status(400);
          return res.send("Database query failed");
      }

      // add comment to database
      newSkill.save(function (err) {
          if (err) {
              res.status(400);
              return console.error(err);
          } else {
              next();
          }
      });
    } else {
      let lengthList = req.body.skills.length
      let i = 0
      for (i; i < lengthList; i++) {
        let newSkill = new Skill({
            user: req.user._id,
            // description: req.body.description[i]
        })

        // need to add this Id to Parent document 'comment' field
        try {
            const filter = {_id: req.user._id};
            const update = {"$push": {"skills": newSkill._id}};
            let user = await User.findOneAndUpdate(filter, update, {new: true});
            console.log(user.skills);
        } catch (err) {
            res.status(400);
            return res.send("Database query failed");
        }

        // add comment to database
        newSkill.save(function (err) {
            if (err) {
                res.status(400);
                return console.error(err);
            } else {
                next();
            }
        });
    }
  }
};

/**
const editExperience = (req,res, next) => {

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
 */

module.exports = {
    addSkill,
    //editExperience,
    //deleteExperience
};