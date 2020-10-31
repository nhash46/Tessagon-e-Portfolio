const mongoose = require("mongoose");

const Report = mongoose.model("Report");
const User = mongoose.model("User");
const Comment = mongoose.model("Comment");

// save report to user and add report collection
const newReport = async (req, res) => {

    let newReport = new Report({
        reportingUser: req.user.username,
        comment: req.params._commentid,
        harassingUser: req.params._harassinguser,

    });

    console.log(newReport.reportingUser);
    console.log(newReport.comment);
    console.log(newReport.harassingUser);


    try {
        const filter = {username: req.params._harassinguser};
        const update = {isReported: true};
        let user = await User.findOneAndUpdate(filter, update);
        
    } catch (err) {
        res.status(400);
        req.session.message = {
          type: 'danger',
          intro: 'Oops, comment could not be reported at this moment.',
          message: " we're looking into it now."
        }
        res.send("Success");
    }

    // add user to database
    newReport.save((err) => {
        if (err) {
            console.log(err);
            req.session.message = {
              type: 'danger',
              intro: 'Oops, comment could not be reported at this moment.',
              message: " we're looking into it now."
            }
            res.send("Success");

        } else {
            req.session.message = {
              type: 'success',
              intro: 'Comment reported.',
              message: ' Administrators will review this comment.'
            }
            res.send("Success");
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