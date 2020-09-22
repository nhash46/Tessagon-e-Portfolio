const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    filename: String,
    contentType: String,
    docType: String

}, { strict: false });

const Document = mongoose.model('Document', documentSchema, 'uploads.files');

module.exports = Document;