const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { strict: false });

const Document = mongoose.model('Document', documentSchema, 'fs.files');

module.exports = Document;