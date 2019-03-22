const express = require('express');
const app = new express();

// 配置session 中间件 使用mongodb保存
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'www3dcom',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30,
    },
    rolling: true,
    store: new MongoStore({
        url: 'mongodb://192.168.1.195:27017/3d',
        // touchAfter:24*3600, // 24小时不更新 除非更改
    }),
}));

//获取post
const bodyParser = require('body-parser');

// 设置body-parser中间件
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 设置模板引擎
const ejs = require('ejs');

// 引入模块
const index = require('./routes/index');

// 设置ejs模板引擎 默认是views
app.set('view engine', 'ejs');

// 配置静态目录 public 作为静态资源目录 我喜欢起别名的方式
app.use('/public', express.static('public'));

// 配置上传的目录图片的访问
app.use('/upload', express.static('upload'));

// 中间件
app.use('/', function (req, res, next) {
    if(req.url == '/'){
        res.redirect('/index/index/index');
    }
    next();
});
// 路由转发
app.use('/index', index);

app.listen(3000, '127.0.0.1');