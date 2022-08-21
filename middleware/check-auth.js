// 该middleware 是一个函数，用于验证传入的token req
const jwt = require('jsonwebtoken'); // 用于生成token（sign），也可以用于验证token（）

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    // 一般真实情况下，Browser向Server发送正式req之前，会默认先发送一个OPTIONS测试req是否能够连接至Server，我们的token validation 应该跳过这个测试req。因为发送OPTIONS req只是Browser的默认的自动行为，该req中不含token，被validation拒绝后会导致程序中断。
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization example: 'Bearer TOKEN', 所以token 是存储在 authorization header 中的字符串value的其中一部分，因此我们需要按' '来拆分split arr拿到arr[1]以得到token。
        // 思考：从前端发送来的token应该放在什么位置？ 如果是在req主体之中，那么有些无req主体的req，比如 DELETE req, GET req，就无法得到并验证token了。
        // 因此我们采用query params(url)传送token， React可以把token放在 req headers 的参数中。
        // headers 是js对象的结尾，是多个键值对，key：headers， value: 这些headers各个header的值。 req headers 的参数不分大小写.
        if (!token) { // 如果：“得到的 token 为空”，报错
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); // 注意jwt.verify：1 需要使用和sign产生token时使用的相同的 key， 2 verify 返回的不是boolean而是解码后的 payload(有效负载)，即一个user对象（有id 和 email）
        req.userData = {userId: decodedToken.userId}; // 添加一个常量：userData，此后的req都能够使用此userData对象，它是req对象的一部分，并获取该userId
        next(); // “继续函数” ： 确保它能够到达validation 之后的任何其它route
    } catch (err) { // 如果该req中没有设置Authentication header, 那么拆分就会失败
        const error = new HttpError('Authentication failed!' , 403);   // (authentication-身份验证，验证失败，state: 403)
        return next(error);
    }
     
}