const express = require('express');
const router = express.Router();
const md5 = require('md5');
const DB = require('../../models/db');
const tools = require('../../models/tools');
const ip = require('ip');

// 登录界面
router.get('/login', function (req, res) {
    res.render('./index/login/login');
});

// 登录
router.post('/loginin', function (req, res) {
    // 获取表单提交的信息
    const postData = {
        username: req.body.username,
        password: req.body.password,
    };
    if (tools._isEmpty(postData.username)) {
        res.json({"status": 500, "msg": "请输入账号"});
    }
    if (tools._isEmpty(postData.password)) {
        res.json({"status": 500, "msg": "请输入密码"});
    }
    DB.findOne('user', {"username": postData.username}, function (err, data) {
        if (data.length > 0) {
            if (md5(postData.password) != data[0].password) {
                res.json({"status": 500, "msg": "密码错误"});
            } else {
                // 更新登录记录
                DB.updateOne('user', {"_id": new DB.ObjectID(data[0]._id)}, {$set: {"lastlogin": (new Date()).getTime(), 'ip': ip.address()}}, function (error, data1) {
                    if (error) {
                        res.json({"status": 500, "msg": "登录失败"});
                    }
                    DB.insertOne('user_log', {"username": postData.username, "type": "登录成功", "logintime": (new Date()).getTime(), 'ip': ip.address()}, function (error1, data2) {
                        if (error1) {
                            res.json({"status": 500, "msg": "登录失败"});
                        }else{
                            req.session.uid = data[0]._id;
                            req.session.username = data[0].username;
                            req.session.avatar = data[0].avatar?data[0].avatar:'/public/images/login.jpg';
                            res.json({"status": 200, "msg": "登录成功"});
                        }
                    });
                });
            }
        } else {
            res.json({"status": 500, "msg": "登录失败"});
        }
    });
});

// 注册账号
router.get('/register', function (req, res) {
    res.render('./index/login/register');
});

// 添加账号
router.post('/registerin', function (req, res) {
    const postData = {
        username: req.body.username,
        password: req.body.password,
    };
    if (tools._isEmpty(postData.username)) {
        res.json({"status": 500, "msg": "请输入账号"});
    }
    if (tools._isEmpty(postData.password)) {
        res.json({"status": 500, "msg": "请输入密码"});
    }
    DB.findOne('user', {"username": postData.username}, function (err, data) {
        if (data.length > 0) {
            res.json({"status": 500, "msg": "账号已存在"});
        }
        DB.insertOne('user', {
            "username": postData.username,
            "password": md5(postData.password),
            "addtime": (new Date()).getTime(),
            "lastlogin": (new Date()).getTime(),
            'ip': ip.address(),
            'avatar': '/public/images/login.jpg',
        }, function (error, datas) {
            if (!err) {
                //console.log(datas);
                req.session.uid = datas.ops[0]._id;
                req.session.username = postData.username;
                req.session.avatar = '/public/images/login.jpg';
                //console.log(req.session);
                DB.insertOne('user_log', {"username": postData.username, "type": "注册成功", "logintime": (new Date()).getTime(), 'ip': ip.address()}, function (error, data) {
                    if (error) {
                        res.json({"status": 500, "msg": "注册失败"});
                    }
                });
                res.json({"status": 200, "msg": "注册成功"});
            } else {
                res.json({"status": 500, "msg": "注册失败"});
            }
        });
    });
});

// 账户退出
router.get('/loginout', function (req, res) {
    DB.insertOne('user_log', {"username": req.session.username, "type": "退出登录", "logintime": (new Date()).getTime(), 'ip': ip.address()}, function (error, data) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/index/login/login');
            }
        })
    });
});

module.exports = router;