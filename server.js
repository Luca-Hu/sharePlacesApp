const fs = require('fs'); // file-system module: 允许我们和 file-system 进行交互，例如允许我们删除文件
const path = require('path'); // 为了返回backend 某一路径下的文件夹里面的图片

const express = require('express');
const bodypaser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error')

const app = express();

app.use(bodypaser.json()); // extract 所有req 内的json 文件，并convert to js data structures like objects or arrays, 并自动next 到下一个middleware

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
// express.static : just return a file. （不execute，只return）
// 在 uploads/images 下的file 将破例（默认情况下不得返回）能够被返回

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * 代表这个header将会attach到所有domain的请求中，允许任务domain向该Server发送req
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );    // 会控制传入的req可以具有哪些headers，以便于处理这些req，可以直接写'*'，这里写的比较具体
    res.setHeader(
            'Access-Control-Allow-Methods', 'GET,POST, PATCH, DELETE');// 会控制（前端）的req中允许发送的methods 
    next();
});

app.use('/api/places/', placesRoutes); 
app.use('/api/users/', usersRoutes);
// 把placesRoutes 作为 middleware 注册register/加入add到 app 中
// Q : 我们希望req只有在以 /api/places/.. 开头时才能到达 places route 
// A : 通过添加过滤器 app.use(‘/api/’, ), 那么req route必须以/api开头！例如如果以/apj开头的path将不会被响应(注意filter只要求path开头如此，整个path可以更长)
// 在places-routes中的get函数中的route则不用更改

app.use((req, res, next) => { // 不写route就是可以对所有req 响应
    const error = new HttpError('Could not find this route.', 404);
    throw error;
}); 
// middleware: 处理errors for unsupported Routes.  注意这个middleware 和以上的“对 Routes 响应” middleware只能访问（be reached）一个。
// 按logic： 在“对 Routes 响应” middleware 之中并没有next， 所以如果进入该middleware， 将不会有其它middleware 被访问

app.use((error, req, res, next) => {  // 前面的任何middleware 出错，都会执行该函数
    if(req.file){ // 为了在出错之后回滚-roll back 过程中产生的文件并删除
        fs.unlink(req.file.path, (err) => { // unlink 就是 delete, 指向文件即可
            console.log(err);
        });
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500); // ps(500 代表server上出现问题)
    res.json({message: error.message || 'An unknown error occurred!'})
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ibpvfro.mongodb.net/shareLocation?retryWrites=true&w=majority`)
    .then(()=>{ 
        app.listen(5000);// 如果和mongoose连接成功，then1: 连接后端服务器
    })
    .catch(err => {
        console.log(err);
    });

