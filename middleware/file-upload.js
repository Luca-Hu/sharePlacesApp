const multer = require('multer');
// 虽然multer 已经是一个middleware， 但我们想要把它按照我们的requirement 来 confire ，告诉它在哪里存储，以及接受哪些文件。
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = { // 此 map 用于告诉multer 我们正在处理哪种类型的文件. 'iamge/png'是multer提取到的js对象的属性
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg',
}

const fileUpload = multer({
    limits : 5000000, // 文件大小： byte 字节单位 = 0.001 kb (此处为5mb), 1000byte = 1 kb, 1000,000byte = 1mb
    storage: multer.diskStorage({ // 配置存储对象
        destination:(req, file, cb) => { // cb 为 callback function: 一旦完成必须调用
            cb(null, 'uploads/images'); // destination: 告诉multer：data储存的地点
        }, 
        filename:(req, file, cb) => { // file ： multer给我的文件对象。 
            const ext = MIME_TYPE_MAP[file.mimetype]; // 用于配制正确的拓展名 type extension
            cb(null, uuidv4() + '.' + ext); // 第一个参数为err，第二个参数为成功后文件生成名称：uuid() + '.' + ext
        }
    }),
    fileFilter: (req, file, cb) => { // 验证我们得到的data是有效的图像文件
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! even true or false
        let error = isValid ? null : new Error('Invalid mime type !');
        cb(error, isValid); 
    }
});

module.exports = fileUpload; // 其它component可以导入这个预配置