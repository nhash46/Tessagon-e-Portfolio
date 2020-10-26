const express = require("express");
const mongoose = require("mongoose");
const adminRouter = express.Router();
const passport = require('passport');
//const adminController = require("../controllers/adminController.js");

adminRouter.get("/", (req, res) => {
    res.render('admin');
});


module.exports = adminRouter;