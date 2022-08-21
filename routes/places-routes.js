const express = require('express');
const { check } = require('express-validator'); // 由于只需要 check 一个方法，所以将 validator 对象解构后导入check 方法

const placesControllers = require('../contollers/places-controllers');
const fileUpload = require('../middleware/file-upload'); // multer中间件 + 预配置
const checkAuth = require('../middleware/check-auth'); // 验证token + 为req添加一个对象req.data，其中是userId

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceByPlaceId); // 连接至一个controller function

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth); // 在此处添加 authentication middleware, 仅对之后的route提供 protection， 也就是说该语句之前的 route 依然对所有用户开放

router.post(
    '/', 
    fileUpload.single('image'), // single(): 就是具体的middleware, 'image'是要求传入的“req中预期主体”的名称，它是我们想提取的图像文件的key
    [
        check('title').not().isEmpty(),
        check('description').isLength({min:5}),
        check('address').not().isEmpty()
    ],
     placesControllers.createPlace); 

router.patch('/:pid',
    [
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
    ],
    placesControllers.updatePlace);

router.delete('/:pid',placesControllers.deletePlace);

module.exports = router; // export module