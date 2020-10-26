const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {validationResult} = require('express-validator');
const { render } = require("pug");

// import user model
const User = mongoose.model("User");
const Report = mongoose.model("Report");