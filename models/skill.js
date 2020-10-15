const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    name: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Skill = mongoose.model("Skill", skillSchema, "skill");

module.exports = Skill;