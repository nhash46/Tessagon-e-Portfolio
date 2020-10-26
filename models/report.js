const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reportingUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    harassingUser: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: String
});

const Report = mongoose.model("Report", reportSchema, "report");

module.exports = Report;