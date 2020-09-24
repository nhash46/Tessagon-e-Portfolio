const expressValidator = require('express-validator');
const {check} = require('express-validator');

// validates that fields arent left empty
exports.addBlog =
    [check('title').isLength({min:1}).trim().withMessage('Title required'),
        check('body').isLength({min:1}).trim().withMessage('Body required')];