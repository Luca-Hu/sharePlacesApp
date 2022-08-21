const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const placeSchema = new Schema({
    // mongoose 会自动创建id
        title:{ type: String, required: true }, // title 类型为 String， 但也要求是 required， 所以使用 对象{} 来描述
        description: {type: String, required: true},
        image: {type: String, required: true },// 在数据库存储的图像类文件一般使用URL，因为db要满足快速查找，所以不适合在db中直接存储大型文件
        location:{
            lat: {type: Number, required: true},
            lng: {type: Number, required: true},
        },
        address:{type: String, required: true},
        creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Place', placeSchema); // 输入集合内单个对象的名称（首字母要求大写），则该集合名为places