const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../contollers/users-controllers');
const fileUpload = require('../middleware/file-upload'); // multer中间件 + 预配置

const router = express.Router();



router.get('/', usersControllers.getUsers); // 连接至一个controller function

router.post(
    '/signup', 
    fileUpload.single('image'), // single(): 就是具体的middleware, 'image'是要求传入的“req中预期主体”的名称，它是我们想提取的图像文件的key
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersControllers.signup
);

router.post('/login', usersControllers.login);


module.exports = router; // export module