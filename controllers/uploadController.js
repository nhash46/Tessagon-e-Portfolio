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
                    filename: filename,
                    // the name of the document collection
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

const uploadLink = async (req,res,next) => {

    //console.log(req.file);
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

        next();
    } catch(err) {
        console.log(err);
        res.status(400);
        return res.send(err);
    }
}

const uploadProfilePic = async (req, res, next) => {

    try {
        if(req.file){
            // add the user id reference
        let doc = await Document.findById({_id: req.file.id})
        doc.user = req.user._id;
        doc.docType = "profilePic";
        //console.log(doc);
        await doc.save();

        let user = await User.findById({_id: req.user._id});
        user.profilePicID = doc._id
        await user.save();
        //console.log(user);
        next();
        } else {
            next();
        }
        
    } catch(err) {
        console.log(err);
        res.status(400);
        return res.send("Didn't work");
    }

}

const getFilesByID = (req, res, next) => {
    gfs.find({user: req.user._id}).toArray((err, files) => {
        if (!files || files.length === 0){
            return res.status(404).json({
                err: 'No files belong to that user'
            });
        }

        files.forEach((element) => {
            console.log(element);
        })

        return res.json(files);
    });
}

const getFileByID = (req, res, next) => {

    const fileId = new mongoose.mongo.ObjectId(req.params.id);

    // console.log('id', req.params.id)
    gfs
        .find({
            _id: fileId
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                console.log('no files exist');
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStream(fileId).pipe(res);
        });
}

const getFileByFilename = (req, res, next) => {
    gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                console.log('no files exist');
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
}

module.exports = {
    upload,
    uploadLink,
    getFilesByID,
    getFileByID,
    getFileByFilename,
    uploadProfilePic
}