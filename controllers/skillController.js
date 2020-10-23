const mongoose = require("mongoose");

const Skill = mongoose.model("Skill");
const User = mongoose.model("User");

// save skill to user and add skill collection
const addSkill = async (req, res, next) => {

    if(!Array.isArray(req.body.skills)){
        let newSkill = new Skill({
            user: req.user._id,
            name: req.body.skills,
        })

        try {
            const filter = {_id: req.user._id};
            const update = {"$push": {"skills": newSkill._id}};
            let user = await User.findOneAndUpdate(filter, update, {new: true});
            //console.log(user.skills);
        } catch (err) {
            res.status(400);
        }

        await newSkill.save(function (err) {
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
                name: req.body.skills[i],
            })

            try {
                const filter = {_id: req.user._id};
                const update = {"$push": {"skills": newSkill._id}};
                let user = await User.findOneAndUpdate(filter, update, {new: true});
                //console.log(user.skills);
            } catch (err) {
                res.status(400);
            }

            await newSkill.save(function (err) {
                if (err) {
                    res.status(400);
                    console.error(err);
                } else {
                    next();
                }
            });
        }
    }
};

const editSkill = (req,res, next) => {

    let skill = {};
    skill.name = req.body.skill_name;
    
    let query = {_id:req.params._id}
  
    // add post into db
    Skill.updateOne(query, skill, function (err) {
      if (err){
        console.log(err);
        res.status(400);
      }
      else{
          res.send('Success')
      } 
    });

};

const deleteSkill = (req, res) => {
  // check if user is logged in
  if(!req.user){
    console.log('user not logged in!');
    res.status(500).send();
  }

  let query = {_id:req.params._id}

  // check if experience object belongs to user
  Skill.findById(query, function(err, skill){
    if(skill.user.toString() != req.user._id.toString()){
      res.status(500).send();
    } 
    else {
      Skill.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success')

      });
    }
  });
}

module.exports = {
    addSkill,
    editSkill,
    deleteSkill
};