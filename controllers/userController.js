
const mongoose = require("mongoose");
const User = mongoose.model("User");

const newUserForm = (req, res) => {
    res.render('signup');
};

module.exports = {
    newUserForm
}