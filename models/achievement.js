const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const achievementSchema = new Schema({
    name: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Achievement = mongoose.model("Achievement", achievementSchema, "achievement");

module.exports = Achievement;