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


module.exports = {
    addAchievement
};