const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // mongoose 会自动创建id
        name:{ type: String, required: true },
        email: {type: String, required: true, unique: true},// 对于value唯一的field，添加unique属性可以在创建db内部索引，加快query speed。
        // 但unique属性并不会去验证email是否真的是unique，所以我们需要添加一个validator。
        password:{type: String, required: true, minlength: 6},
        image: {type: String, required: true },// 在数据库存储的图像类文件一般使用URL，因为db要满足快速查找，所以不适合在db中直接存储大型文件
        places: [{type: mongoose.Types.ObjectId, required: true, ref: 'Place'}] 
        // 添加数组符号，以告知mongoDB：符合的places不止一个对象，而是个array
});

userSchema.plugin(uniqueValidator); // 添加一个validator以验证unique属性 必须唯一

module.exports = mongoose.model('User', userSchema); // 输入集合内单个对象的名称（首字母要求大写），则该集合名为places