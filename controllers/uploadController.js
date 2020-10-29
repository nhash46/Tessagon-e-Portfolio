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
    //console.log("The gfs object" + gfs);
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

const uploadDocument = async (req,res,next) => {

    try {
        if(req.file) {
            // add the user id reference
            let doc = await Document.findById({_id: req.file.id})
            doc.user = req.user._id;
            doc.title = req.body.title;
            doc.subHead = req.body.subHead
            //console.log(doc);
            await doc.save();

            // add the file id reference to the user
            const filter = {_id: req.user._id};
            const update = {"$push": {"document": req.file.id}};
            let user = await User.findOneAndUpdate(filter, update, {new: true});
            //console.log(user.document);
            req.session.message = {
                type: 'success',
                intro: 'Document uploaded!',
                message: ''
            }
            next();
        }
        else{
            next();
        }
    } catch(err) {
        console.log(err);
        res.status(400);
        return res.send(err);
    }
}

const uploadResume = async (req,res,next) => {

    try {
        if(req.files['resume']) {
            // add the user id reference
            let doc = await Document.findById({_id: req.files['resume'][0].id})
            doc.user = req.user._id;
            doc.title = req.body.title;
            doc.subHead = req.body.subHead;
            doc.docType = 'resume';
            //console.log(doc);
            await doc.save();

            // add the file id reference to the user
            let user = await User.findById({_id: req.user._id});
            user.resumeID = doc._id
            await user.save();
            //console.log(user.document);
            req.session.message = {
                type: 'success',
                intro: 'Resume updated!',
                message: ''
            }
            next();
        }
        else{  
            next();
        }
    } catch(err) {
        console.log(err);
        res.status(400);
        return res.send(err);
    }
}

const uploadProfilePic = async (req, res, next) => {

    try {
        if(req.files['propic']){
            // add the user id reference
            let doc = await Document.findById({_id: req.files['propic'][0].id})
            doc.user = req.user._id;
            doc.docType = "profilePic";
            //console.log(doc);
            await doc.save();

            let user = await User.findById({_id: req.user._id});
            user.profilePicID = doc._id
            await user.save();
            //console.log(user);
            req.session.message = {
                type: 'success',
                intro: 'Profile picture updated!',
                message: ''
            }
            next();
        }
        else {
            next();
        }
        
    } catch(err) {
        console.log(err);
        res.status(500);
        // Need error page handling
        return res.send("Didn't work");
    }
}

const uploadBackgroundPic = async (req, res, next) => {

    try {
        if(req.file){
            // add the user id reference
            let doc = await Document.findById({_id: req.file.id})
            doc.user = req.user._id;
            doc.docType = "backgroundPic";
            //console.log(doc);
            await doc.save();

            let user = await User.findById({_id: req.user._id});
            user.backgroundPicID = doc._id
            await user.save();
            //console.log(user);
            next();
        } else {
            next();
        }

    } catch(err) {
        console.log(err);
        res.status(500);
        // Need error page handling
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

const getImageByFilename = (req, res, next) => {
    gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                //console.log('no files exist');
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
}

const getResumeByFilename = (req, res, next) => {
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

            res.set('Content-Type', files[0].contentType);

            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
}

const getDocumentByFilename = (req,res,next) => {

    gfs
        .find({
            filename: req.params.filename
        })
        .toArray(function(err, files){
            if(!files || files.length === 0){
                //console.log('no files exist');
                return res.status(404).json({
                    err: "no files exist"
                });
        }

        res.set('Content-Type', files[0].contentType);
        res.set('Content-Disposition', `inline; filename:`+req.params.filename);
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
}

const deleteDocument = (req,res) => {

    const fileId = new mongoose.mongo.ObjectId(req.params._id);

    gfs.delete(fileId, (err, GridFSBucket) => {
        if (err) {
            console.log(err.message);
            req.session.message = {
                type: 'danger',
                intro: 'Oops, something went wrong.',
                message: ' Document was not deleted.'
            }
            res.send('Success');
            //res.status(500).send("Server Error");
        } else {
            req.session.message = {
                type: 'success',
                intro: 'Document deleted!',
                message: ''
            }
            res.send('Success');
        }
       
    });
};

module.exports = {
    upload,
    uploadDocument,
    uploadResume,
    uploadProfilePic,
    uploadBackgroundPic,
    getFilesByID,
    getFileByID,
    getImageByFilename,
    getDocumentByFilename,
    getResumeByFilename,
    deleteDocument
}