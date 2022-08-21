// controller 负责“实现所有的middleware功能”， 包括针对route的响应函数middleware。
const fs = require('fs'); // 为了删除image file, 需要导入 file system 。 它允许我们访问 files， 并可以删除它们（unlink）

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error'); // 这个类本质是个构造函数，所以命名使用大写首字母
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

// 建立函数的两种方法：
// function getPlaceById(){...}
// const getPlaceById => {...}

const getPlaceByPlaceId = async (req, res, next) => {  // mongoose 的 findById 是一个需要不少时间的任务，为了safe，我们将使用async await语法
    const placeId = req.params.pid; // express-params: 拿到req route 中的参数

    let place;
    try{
        place = await Place.findById(placeId); // findById是一个static method，它不在实例上运行，而是在构造器上运行。另外它不返回promise（不过可以使用await和try/catch），如果需要得到一个promise，使用.exec()以得到。
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    } // 如果 req 有问题，报错

    if(!place){ // 如果req没问题，但db中找不到place，报错
        const error = new HttpError('could not find a place for the provided place id.', 404); // this will triger the error handling middleware. And end running.
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});     
    // 将res中的data转化为json格式并返回 // 传值时，由于两边属性名相同，使用shortcut: {place} => {place: place},  （当然，如果两边属性名不同，就不能使用shortcut）
    // 此时的place对象是从mongoDB中拿出的对象，我们再把它转化为普通的js对象 .toObject() ，并且把其id 的下划线去掉: getters:true -> id改为无下划线的字符串形式
};

// 注意：由于现在有/:id 具体值，所以不会被系统误认，但如果只是‘/user’，可能‘user’会被误认为 pid 的值，所以get的顺序也要注意
const getPlacesByUserId = async (req, res, next) => {  // retrieve list of all places for a givem user id
    const userId = req.params.uid; 

    let userWithPlaces;
    try{
        userWithPlaces = await User.findById(userId).populate('places'); // 注意 mongobd 的 find 返回的是一个cursor，指向所有结果并允许iterate, 但此处的 mongoose 的 find 返回的是一个array
    } catch(err){
        const error = new HttpError('Something went wrong, could not fetch places.', 500);
        return next(error);
    } // 如果 req 有问题，报错

    if (!userWithPlaces || userWithPlaces.places.length === 0) { // // 如果req没问题，但db中找不到places，报错
        return next(new HttpError('could not find places for the provided  user id.', 404)); // this will triger the error handling middleware. return next() could end running.
    }

    res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
    // 注意：此时的places是mongoose 用find 从mongoDB中拿出的array，需要使用“js中的map函数”才能把“数组”转化为“单个对象”进行“转化为js对象”处理
};

const createPlace = async (req, res, next) => {  // 在function 的参数列表前加上async，将其转化为 async function 
    const errors = validationResult(req);  // 检查req 输入是否valid
    if(!errors.isEmpty()){
        next( new HttpError('Invalid inputs pass, please check your data.', 422));  //在async 代码中，express的 throw 无法工作，只能使用next 处理 error
    }

    const {title, description, address } = req.body; // extraction (destructure) 
    // 删除 creator，因为这是从frontend 发送的req中的creator id, 但frontend 很可能得到无效的 creator id, 所以作为改进，我们的creator id 不再使用从frontend输入的，转而使用userData中提取的userId！注意前端的req也应该删除字段。
    
    let coordinates;
    try{
         coordinates = await getCoordsForAddress(address); // 异步函数 getCoordsForAddress(address) 会返回一个 promise，我们必须用 await 去等待它
    } catch (error){ // 由于该函数可能抛出一个 error，在异步函数中，如果要处理 error ，必须把它包装到一个 try/catch block中
        return next(error); // 如果返回的是个error, 那么以下代码不执行
    }

    const createdPlace = new Place({
        title, 
        description,
        image: req.file.path,
        location: coordinates,
        address,
        creator: req.userData.userId
    });

    let user; // 手动检验：新建立的place的creator是否存在于mongoDB的users集合中 // creator 更改为 req.userData.userId
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }    

    if(!user){
        const error = new HttpError('Could not find user for provided id, please try again', 404);
        return next(error);
    }

    // 如果检验完毕，creator确实valid，那么使用transaction & session 去完成2件独立operations：1创建document储存place， 2把该place的id添加到user的places中.
    try{ // 使用 try-catch处理 
        const sess = await mongoose.startSession(); 
        sess.startTransaction();
        // 已经成功初始化transaction & session，接下来告诉mongoDB你要做什么
        // {session: sess}： 添加参数：session property : sess
        await createdPlace.save({session: sess}); // save() 会把该document保存至db中，并且为其创建id，而且save是一个async-promise任务, 它必须等待createdPlace完全被创建才会运行.
        user.places.push(createdPlace); // 这里的push 是mongoose提供的方法，to establish connection between models. 注意这里只存放 createdPlace的id
        await user.save({session: sess});
        await sess.commitTransaction(); // 只有在此时，即commit之后，变化才会保存于DB中。 如果中途有任何错误都会回滚至session建立的起点
    } catch (err){
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace}) // successfully created! : 201.  /  json({place: }) 保留创建的位置
};

const updatePlace = async (req, res, next) => { // 只允许更新 title 和 description。 
    const errors = validationResult(req); // 检查req 输入是否valid
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs pass, please check your data.', 422);
    }

    const {title, description, coordinates, address, creator} = req.body; // extraction (destructure)
    const placeId = req.params.pid;

    let place; 
    try{
        place = await Place.findById(placeId);  // 先由id找到要更新的place， 这一步和findPlaceByPlaceId 一样
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    } // 如果 req 有问题，报错

    if(!place){ // 如果req没问题，但db中找不到place，报错
        const error = new HttpError('could not find a place for the provided place id.', 404);
        return next(error);
    }
    
    if(place.creator.toString() !== req.userData.userId){ // 如果该地点的创建者 不是 现登录的用户，不允许修改.
        // 注意 place.creator 是一个 moogoDB 对象，需要用 toString() 转化为字符串才能开始比较
        const error = new HttpError('Sorry, you don\'t have permission to edit.', 401); // 授权错误：401
        // 输出引号的转义字符：\' ,  \"
        return next(error);
    }
    
    // update place
    place.description = description; // Why可以更新const 值？  A ：在js中，const 类型只存放地址，不存放对象本身。
    place.title = title;

    try{ // 使用 try-catch处理 err
        await place.save(); // save是一个async-promise任务
    } catch (err){
        const error = new HttpError('Updating place failed, please try again', 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters: true })});
} 

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid; // 如果要delete的place不存在，报错

    let place; 
    try{
        place = await Place.findById(placeId).populate('creator');  // 先由id找到要更新的place， 这一步和findPlaceByPlaceId 一样
        // populate 的使用前提是已经在schema中建立了ref联系，它让我们可以直接访问另一个集合中的document 对象的全部内容。
        // 它使得我们不用再靠 user = await User.findById(creator); 来寻找 creator 对象，而是可以直接使用 place.creator 来得到
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place.', 500);
        return next(error);
    } // 如果 req 有问题，报错

    if(!place){ // 如果req没问题，但db中找不到place，报错
        const error = new HttpError('could not find a place for the provided place id.', 404);
        return next(error);
    }

    if(place.creator.id !== req.userData.userId){ // 如果该地点的创建者 不是 现登录的用户，不允许删除.
        // 注意:和update中不同，这里的 place.creator 是populate直接拿到的 js 对象，
        const error = new HttpError('Sorry, you don\'t have permission to delete.', 401); // un-authorize 授权错误：401(注意这意味着通过了  authentication-身份验证，只不过无权限进行该操作，如果验证也失败，state: 403)
        // 输出引号的转义字符：\' ,  \"
        return next(error);
    }

    const imagePath = place.image;

    try{ // 使用 try-catch处理 err
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session:sess}); // remove和save一样，也是一个async-promise任务
        place.creator.places.pull(place); // populate gave us the full object linked to that place.
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    } catch (err){
        const error = new HttpError('Deleting place failed, please try again', 500);
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err); // 图片删除不成功，可以后台手动删除，不算大问题，输出err即可，没有必要中止程序
    }); // 删除image file

    res.status(200).json({message: 'Deleted place.'});
}


exports.getPlaceByPlaceId = getPlaceByPlaceId;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;