var express = require('express');
var router = express.Router();

var userRouter = require('../controller/userCtrl.js');

router
  .get('/register',userRouter.showRegisterPage)//获取登录界面
  .post('/register',userRouter.registerNewUser)//提交注册信息
  .get('/login',userRouter.showLoginPage)//展示登陆界面
  .post('/login',userRouter.loginUser)//提交登陆信息
  .get('/logout',userRouter.logout)//注销登陆



module.exports = router;