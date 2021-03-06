const mongoose = require("mongoose");

const Education = mongoose.model("Education");
const User = mongoose.model("User");


// adds a comment to comment collection
const addEducation = async (req, res, next) => {

    if(!Array.isArray(req.body.university)){
        let newEducation = new Education({
            user: req.user._id,
            university: req.body.university,
            degree: req.body.degree,
            educationStartDate: req.body.educationStartDate,
            educationEndDate: req.body.educationEndDate,
            descriptionEdu: req.body.descriptionEdu
        });

        // need to add this Id to Parent document 'comment' field
        try {
            const filter = {_id: req.user._id};
            const update = {"$push": {"education": newEducation._id}};
            let user = await User.findOneAndUpdate(filter, update, {new: true});
            //console.log(user.education);
        } catch (err) {
            res.status(400);
            //return res.send("Database query failed");
            next();
        }

        // add comment to database
        newEducation.save(function (err) {
            if (err) {
                return console.error(err);
            } else {
                res.status(302);
                req.session.message = {
                  type: 'success',
                  intro: 'Education added!',
                  message: ''
                }
                next();
            }
        });
    }
    else{
        let lengthList = req.body.university.length
        let i = 0
        for (i ; i < lengthList; i++) {
            let newEducation = new Education({
                user: req.user._id,
                university: req.body.university[i],
                degree: req.body.degree[i],
                educationStartDate: req.body.educationStartDate[i],
                educationEndDate: req.body.educationEndDate[i],
                descriptionEdu: req.body.descriptionEdu[i]
            });

            // need to add this Id to Parent document 'comment' field
            try {
                const filter = {_id: req.user._id};
                const update = {"$push": {"education": newEducation._id}};
                let user = await User.findOneAndUpdate(filter, update, {new: true});
                //console.log(user.education);
            } catch (err) {
                res.status(400);
                //return res.send("Database query failed");
                next()
            }

            // add comment to database
            newEducation.save(function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    res.status(302);
                    next();
                }
            });
        }
    }
};

const editEducation = (req,res,next) => {

    let education = {};

    education.university = req.body.university;
    education.degree = req.body.degree;
    education.educationStartDate = req.body.educationStartDate;
    education.educationEndDate = req.body.educationEndDate;
    education.descriptionEdu = req.body.descriptionEdu;
    
    let query = {_id:req.params._id}
  
    // add post into db
    Education.updateOne(query, education, function (err) {
      if (err){
          console.log(err);
          res.status(400);
      }
      else{
          req.session.message = {
            type: 'success',
            intro: 'Education updated!',
            message: ''
          }
          res.send("Success");
      } 
    });

};

const deleteEducation = (req, res) => {
  // check if user is logged in
  if(!req.user){
    console.log('user not logged in!');
    res.status(500).send();
  }

  let query = {_id:req.params._id}

  // check if education object belongs to user
  Education.findById(query, function(err, education){
    if(education.user.toString() != req.user._id.toString()){
      //console.log('experience user _id: ' + experience.user._id);
      //console.log('global user _id:     ' + req.user._id);
      //console.log('_id not found!');
      res.status(500).send();
    } 
    else {
      Education.remove(query, function(err){
        if(err){
          console.log(err);
        }
        req.session.message = {
          type: 'success',
          intro: 'Education deleted!',
          message: ''
        }
        res.send('Success')

      });
    }
  });
}

module.exports = {
    addEducation,
    editEducation,
    deleteEducation
};