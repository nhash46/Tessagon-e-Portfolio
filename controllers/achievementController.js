const mongoose = require("mongoose");

const Achievement = mongoose.model("Achievement");
const User = mongoose.model("User");

// save achievement to user and add achievement object collection
const addAchievement = async (req, res, next) => {

    if(!Array.isArray(req.body.achievement)){
        let newAchievement = new Achievement({
            user: req.user._id,
            name: req.body.achievement,
        })

        try {
            const filter = {_id: req.user._id};
            const update = {"$push": {"achievement": newAchievement._id}};
            let user = await User.findOneAndUpdate(filter, update, {new: true});

        } catch (err) {
            res.status(400);
        }

        await newAchievement.save(function (err) {
            if (err) {
                res.status(400);
                return console.error(err);
            } else {
                next();
            }
        });
    } else {
        let lengthList = req.body.achievement.length
        let i = 0
        for (i; i < lengthList; i++) {
            let newAchievement = new Achievement({
                user: req.user._id,
                name: req.body.achievement[i],
            })

            try {
                const filter = {_id: req.user._id};
                const update = {"$push": {"achievement": newAchievement._id}};
                let user = await User.findOneAndUpdate(filter, update, {new: true});

            } catch (err) {
                res.status(400);
            }

            await newAchievement.save(function (err) {
                if (err) {
                    res.status(400);
                    console.error(err);
                } else {
                    next();
                }
            });
        }
    }
};

const editAchievement = (req,res, next) => {

    let achievement = {};
    achievement.name = req.body.achievementName;

    let query = {_id:req.params._id}

    // add post into db
    Achievement.updateOne(query, achievement, function (err) {
        if (err){
            console.log(err);
            res.status(400);
        }
        else{
            req.session.message = {
                type: 'success',
                intro: 'Achievement updated!',
                message: ''
            }
            res.send('Success');
        }
    });

};

const deleteAchievement = (req, res) => {
    // check if user is logged in
    if(!req.user){
        console.log('user not logged in!');
        res.status(500).send();
    }

    let query = {_id:req.params._id}

    // check if achievement object belongs to user
    Achievement.findById(query, function(err, achievement){
        if(achievement.user.toString() != req.user._id.toString()){
            res.status(500).send();
        }
        else {
            Achievement.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success')

            });
        }
    });
}

module.exports = {
    addAchievement,
    editAchievement,
    deleteAchievement
};