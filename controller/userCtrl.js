var userModel = require('../model/userModel');
var md5 = require('blueimp-md5');
var config = require('../config.js');
module.exports = {
  showRegisterPage(req,res){//展示注册界面
    res.render('./user/register',{});
  },
  registerNewUser(req,res){//注册新用户
    // 1.获取提交过来的用户信息 req.body 注册的中间件叫做body-parser
    var user = req.body;
    // console.log(user);  { username: 'ls', password: '123', nickname: 'haha' }
    // 2.根据对象的username来查询数据库中是否含有，没有就注册
    userModel.getUserByName(user.username,(err,results)=>{
      if(err) return res.json({err_code:1,msg:'注册失败！'});
      if(results.length!==0) return res.json({err_code:1,msg:'注册失败~！'});
      // console.log(results);
      // 3.如果数据库没有此用户信息，即成功开始把信息写入数据库
      user.password = md5(user.password,config.pwdSalt);//使用md5对密码进行加密加盐处理
      userModel.registerNewUser(user,(err,results)=>{
      // console.log(results);OkPacket {fieldCount: 0, affectedRows: 1,insertId: 4,serverStatus: 2, warningCount: 0, message: '',                                           protocol41: true, changedRows: 0 }
        if(err) return res.json({err_code:1,msg:'注册失败！'});
        if(results.affectedRows!==1) return res.json({err_code:1,msg:'注册失败~！'});
        res.json({err_code:0});
      });
    });

  },
  showLoginPage(req,res){//展示登陆界面
    res.render('./user/login',{});
  },
  loginUser(req,res){//提交登陆
    //1.获取到post过来的登陆账号和密码，去数据库里查找,找回来之后返回的数据results 是一个 数 组
    var user = req.body;
    user.password = md5(user.password,config.pwdSalt);
    userModel.loginUser(user,(err,results)=>{
      // console.log('返回过来的数据'+results);
      if(err||results.length!==1) return res.json({err_code:1,msg:'登陆失败！'});

      // 在返回登陆成功前，把登陆信息 保存到session中
      req.session.islogin = true;
      req.session.user = results[0];

      res.json({err_code:0});
    });

  },
  logout(req,res){//注销登陆
    //分析：登陆状态的保持，使用过session技术实现的;是直接 调用req.session.***来保存的
    // req.session.islogin = null;
    // req.session.user = null;
    req.session.destroy((err)=>{
      if(err){
        console.log('注销失败');
        res.redirect('/');
      }
      console.log('注销成功');
      res.redirect('/');
    });

  }
}