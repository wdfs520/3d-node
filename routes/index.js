const express = require('express');
const router = express.Router();

const login = require('./index/login');
const index = require('./index/index');

// 配置路由

router.use(function (req,res,next) {
    next();
});

router.use('/login',login);
router.use('/index',index);

// 暴露模块
module.exports = router;