const express = require('express');
const router = express.Router();
const md5 = require('md5');
const DB = require('../../models/db');
const tools = require('../../models/tools');
const moment = require('moment');
const ip = require('ip');
const multiparty = require('multiparty');
/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
const fs = require('fs');

router.use('/', function (req, res, next) {

    if (tools._isEmpty(req.session.username)) {
        res.redirect('/index/login/login');
    }
    req.app.locals['uid'] = req.session.uid;
    req.app.locals['username'] = req.session.username;
    req.app.locals['avatar'] = req.session.avatar ? req.session.avatar : '/public/images/login.jpg';
    next();
});

// 主界面
router.get('/index', function (req, res) {
    res.render('./index/index/index');
});

// 操作记录 处理分页
router.get('/record', function (req, res) {

    let page = req.query.page ? req.query.page : 1;
    let offset;
    let showPage;

    // 查询总数
    DB.count('user_log', {"username": req.session.username}, function (err, data) {
        if (data > 0) {
            showPage = tools._getPageUI(page, data, 15, '/index/index/record');
            offset = parseInt(showPage.currentPage - 1)
            if (offset <= 0) {
                offset = 0;
            } else {
                offset = offset * showPage.offset;
            }
            DB.find('user_log', {"username": req.session.username}, offset, showPage.offset, {logintime: -1}, function (err1, data1) {
                for (let i = 0; i < data1.length; i++) {
                    data1[i]['addtime'] = moment(data1[i]['logintime']).format('YYYY-MM-DD HH:mm:ss');
                }
                res.render('./index/index/record', {
                    list: data1,
                    showPage: showPage.html,
                });
            })
        } else {
            res.render('./index/index/record', {
                list: [],
                showPage: '',
            });
        }
    });
});

// 修改密码页面
router.get('/password', function (req, res) {
    res.render('./index/index/password');
});

// 修改密码操作
router.post('/dopassword', function (req, res) {

    const form = new multiparty.Form();
    form.uploadDir = 'upload'; //上传图片保存的地址 目录必须存在
    form.parse(req, function (err, fields, files) {
        //console.log(files.avatar[0]);
        // 判断老密码数据对不对
        DB.findOne('user', {"username": req.session.username}, function (err1, data) {
            if (err1) {
                _unlinktemp(files.avatar[0].path);
                res.json({"status": 500, "msg": "数据错误"});
            }

            if (data[0].password != md5(fields.old_password[0])) {
                _unlinktemp(files.avatar[0].path);
                res.json({"status": 500, "msg": "原密码错误"});
            } else {
                let setData = {
                    "password": md5(fields.new_password[0]),
                };
                //console.log(files.avatar[0]);
                if (files.avatar[0].size > 0) {
                    setData = {
                        "password": md5(fields.new_password[0]),
                        "avatar": '/' + files.avatar[0].path,
                    }
                }
                DB.updateOne('user', {"username": req.session.username}, {$set: setData}, function (error, datas) {
                    if (error) {
                        _unlinktemp(files.avatar[0].path);
                        res.json({"status": 500, "msg": "修改密码失败"});
                    }
                });
                DB.insertOne('user_log', {"username": req.session.username, "type": "修改密码成功", "logintime": (new Date()).getTime(), 'ip': ip.address()}, function (error, datas) {
                    if (files.avatar[0].size > 0) {
                        req.session.avatar = '/' + files.avatar[0].path;
                        if (data[0].avatar) {
                            _unlinktemp(data[0].avatar.replace('/', ''));
                        }
                    } else {
                        _unlinktemp(files.avatar[0].path);
                    }
                    res.json({"status": 200, "msg": "修改密码成功"});
                });
            }
        });
    });
});

// 删除多余的图片
function _unlinktemp(path) {
    fs.unlink(path, function (err) {
        if (err) {
            throw err;
        }
    });
}


module.exports = router;
