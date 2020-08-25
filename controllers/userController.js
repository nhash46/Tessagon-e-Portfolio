
const mongoose = require("mongoose");
const User = mongoose.model("User");

const newUserForm = (req, res) => {
    res.send('<H1>User Page</H1>');
};

module.exports = {
    newUserForm
}