const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    reportingUser: String,
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    harassingUser: String,
    date: Date
});

const Report = mongoose.model("Report", reportSchema, "report");

module.exports = Report;