const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const educationSchema = new Schema({
    university: String, 
    degree: String,
    educationStartDate: Date,
    educationEndDate: Date,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Education = mongoose.model("Education", educationSchema, "education");

module.exports = Education;
