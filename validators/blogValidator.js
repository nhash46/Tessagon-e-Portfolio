const expressValidator = require('express-validator/check');
const {check} = require('express-validator/check');

// validates that fields arent left empty
exports.addBlog =
    [check('title').isLength({min:1}).trim().withMessage('Title required'),
        check('body').isLength({min:1}).trim().withMessage('Body required')];