const expressValidator = require('express-validator/check');
const {check} = require('express-validator/check');

exports.addUser =
    [
        // validates password are matching
        check('password2').custom((value,{req, loc, path}) => {
            if (value !== req.body.password) {
                //$(document.getElementById("#inputConfirmPassword").popover())
                // throw error if passwords do not match
                throw new Error("Try again.");
            } else {
                return value;
            }
        }),
    ];