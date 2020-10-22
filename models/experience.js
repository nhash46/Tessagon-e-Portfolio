const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    company: String, 
    role: String,
    experienceStartDate: Date,
    experienceEndDate: Date,
    descriptionExp: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Experience = mongoose.model("Experience", experienceSchema, "experience");

module.exports = Experience;