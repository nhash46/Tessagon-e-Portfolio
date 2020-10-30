const mongoose = require("mongoose");

const Report = mongoose.model("Report");
const User = mongoose.model("User");
const Comment = mongoose.model("Comment");

// save report to user and add report collection
const newReport = async (req, res, next) => {

    let newReport = new Report({
        reportingUser: req.body.reportingUser,
        comment: req.body.email,
        harassingUser: req.body.harassingUser,

    });

    // add user to database
    newReport.save((err) => {
        if (err) {
            console.log(err);

        } else {
            next();
        }
    });

};

const deleteReport = (req, res) => {
  // check if user is logged in
  if(!req.user){
    console.log('user not logged in!');
    res.status(500).send();
  }

  let query = {_id:req.params._id}

  // check if experience object belongs to user
  Report.findById(query, function(err, report){
      Report.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success')

      });
  });
}

module.exports = {
    newReport,
    deleteReport
};