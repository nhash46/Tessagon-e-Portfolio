const mongoose = require("mongoose");

const Education = mongoose.model("Education");
const User = mongoose.model("User");

// adds a comment to comment collection
const addEducation = async (req, res) => {

    var newEducation = new Education({
        user: req.user._id,  
        university : req.body.university,
        degree : req.body.degree,
        educationStartDate : req.body.educationStartDate,
        educationEndDate : req.body.educationEndDate
    });

    // need to add this Id to Parent document 'comment' field 
    try{
        const filter = { _id: req.user._id};
        const update = { "$push" : {"education" : newEducation._id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.education);
    } catch(err){
        res.status(400);
        return res.send("Database query failed");
    }

    // add comment to database
    newEducation.save(function (err) {
      if (err) {
          return console.error(err);
      } else {
        res.status(302);
        res.redirect('/user/profile');
      }
    });
  };

const editEducation = (req,res,next) => {
    let education = {_id:req.education._id};

    education.university = req.body.university;
    education.degree = req.body.degree;
    education.educationStartDate = req.body.educationStartDate;
    education.educationEndDate = req.body.educationEndDate;

    try{
        const filter = { _id: req.user._id};
        const update = { "$push" : {"education" : education._id}};
        //new might be false depending on implimentation
        let user = User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.education);
    } catch(err){
        res.status(400);
        return res.send("Database query failed");
    }

    education.save(function (err) {
        if (err) {
            res.status(400);
            return console.error(err);
        } else {
            next();
        }
    });

};

module.exports = {
    addEducation,
    editEducation
};