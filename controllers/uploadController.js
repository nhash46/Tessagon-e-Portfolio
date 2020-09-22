const mongoose = require("mongoose");
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');

const db = require("../models");

const User = mongoose.model("User");
const Document = mongoose.model("Document");

let gfs;
mongoose.connection.once("open", async () => {
    // Init stream
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    //gfs.collection('uploads');
    console.log("The gfs object" + gfs);
});

const uploadFile = async (req,res,next) => {

    console.log(req.file);
    try {
        // add the user id reference
        let doc = await Document.findById({_id: req.file.id})
        doc.user = req.user._id;
        console.log(doc);
        await doc.save();

        // add the file id reference to the user
        const filter = { _id: req.user._id};
        const update = { "$push" : {"document" : req.file.id}};
        let user = await User.findOneAndUpdate(filter, update, {new : true});
        console.log(user.document);

        res.redirect('/user/profile');
    } catch(err) {
        res.status(400);
        return res.send("Didn't work");
    }
}

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
    uploadFile
}