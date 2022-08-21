// controller 中装载针对route的响应函数，controller实现了其中所有的middleware功能

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // npm 下载包，用于 hash password
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error'); // 这个类本质是个构造函数，所以命名使用大写首字母
const User = require('../models/user');

const getUsers = async (req, res ,next) => {
    let users;
    try{
        users = await User.find({}, '-password'); // 或者 find({}, 'name email'). 注意： find returns a array！
    } catch(err) {
        const error = new HttpError('Fetching users failed, please try again.', 500);
        return next(error);
    }

    // 注意： find returns a array！ 所以需要使用map 处理array 对象.toOject.  此处res.data 将为“全部users的info”
    res.json({users: users.map(user => user.toObject({getters : true}))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req); // 检查req 输入是否valid
    if(!errors.isEmpty()){ 
        const error = new HttpError('Invalid inputs pass, please check your data.', 422);
        return next(error);
    }

    const {name, email, password} = req.body;  // extraction (destructure) // 不用从req中添加places，因为places是自动从mongoDB中添加的

    let existingUser; //验证email是否未注册
    try{
        existingUser = await User.findOne({ email: email});  // 只寻找一个，属于 async task
    } catch(err){
        const error = HttpError('Something went wrong, could not signup.', 500);
        return next(error);
    } // 尽管我们已经有validator来验证email未注册,但为了提升用户体验，我们应该给予用户反馈具体的error信息

    if(existingUser){ 
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    } // 如果没有注册过才可以继续

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12); 
        // 第一个参数：这里的password 是由 http res 传回的data。 第二个参数：salting rounds（每轮salting都是在上一轮的“结果data”上再附加“salt data”并hash，以加大hash value的复杂度）
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500); // 500:technical server side error
        return next(error);
    }
   
    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword, // 我们将在authentication中 加密password！
        places:[]
    });

    try{ // 使用 try-catch处理 err
        await createdUser.save(); 
    } catch (err){
        const error = new HttpError('User Signup failed, please try again.', 500);
        return next(error);
    }

    let token; // 准备创建token。 token的作用 : 告诉server : This is me! I logged in!
    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn:'1h'}); 
        // The sign method return a string. the string is the token.  
        // The first argument is load content.  The second argument is the private key, you never ever share this key with any client, it only in your server-side code.
        // The third argument is token 的有效时长
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again.', 500); 
        return next(error);
    }
    
    res.status(201).json({userId: createdUser.id, email:createdUser.email, token: token}) ; // 不再返回整个user object，返回至前端的数据可以由自己来确定。React可以使用token附加在req上，以通过需要authentication的route
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser; //验证email是否未注册
    try{
        existingUser = await User.findOne({ email: email});  // 只寻找一个，属于 async task
    } catch(err){
        const error = HttpError('Something went wrong, could not signup.', 500);
        return next(error);
    } // 尽管我们已经有validator来验证email未注册,但为了提升用户体验，我们应该给予用户信息

    if(!existingUser){ 
        const error = new HttpError('User not exists, please signup instead.', 401);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password); 
        // 第一个参数：这里的password 是由 http res 传回的data。 第二个参数：salting rounds（每轮salting都是在上一轮的“结果data”上再附加“salt data”并hash，以加大hash value的复杂度）
    } catch (err) {
        const error = new HttpError('Could not log you in, please try again.', 500); // 500:technical server side error
        return next(error);
    }

    if(!isValidPassword){ // 检查密码: 如果密码错误，输出error
        const error = new HttpError('Password wrong, please try again.', 403); // (authentication-身份验证，验证失败，state: 403)
        return next(error);
    }
    
    let token; // 准备再次生成token (注意private key 不能更改), 并 validate this token
    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {expiresIn:'1h'}); 
    } catch (err) {
        const error = new HttpError('Logining up failed, please try again.', 500); 
        return next(error);
    }
    
    res.json({userId: existingUser.id, email:existingUser.email, token: token}); // 不再返回整个user object，返回至前端的数据可以由自己来确定。 React可以使用token附加在req上，以通过需要authentication的route
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;