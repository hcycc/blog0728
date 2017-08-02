/**
 * Created by hcy on 2017/7/28.
 */
var express = require('express');
var router = express.Router();
// 导入首页的controller
var indexCtrl = require('../controller/indexCtrl');

router
    .get('/',indexCtrl.showIndexPage);


module.exports = router;