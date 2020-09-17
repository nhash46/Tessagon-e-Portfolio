const mongoose = require("mongoose");
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const path = require('path');

const db = require("../models");

const User = mongoose.model("User");
const Document = mongoose.model("Document");

// Upload file storage
const storage = new GridFsStorage({
    url: db.MONGO_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    // ref to parent user
                    user: req.user._id,
                    filename: filename,
                    // the name of the document collection
                    bucketName: 'fs.files'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

const uploadProfilePic = async (req,res,next) => {

    // uploads the file to the fs.files collection, linked to the parent user
    upload.single('file');

    // giving the file id to the user so it can populate the field later
    try{
        console.log(req.file);
        const filter = { _id: req.user._id};
        const update = { "$push" : {"document" : req.file._id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.document);
    } catch(err){
        res.status(400);
        return res.send("Didn't work dumbass");
    }
}
module.exports = {
    uploadProfilePic,
    upload
}