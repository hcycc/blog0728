/**
 * Created by hcy on 2017/7/28.
 */
var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

// 设置默认的模板引擎
app.set('view engine','ejs');
// 设置引擎存放路径
app.set('views','./views');

app.use('/node_modules',express.static('node_modules'));


// 导入 解析表单post  提交上来的数据的 一个第三方插件
// 会解析出一个数据对象，通过自定义属性的形式， 追加为了 req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

// 注册session中间件
var session = require('express-session');
// 使用 app.use 把session 中间件注册 到当前的服务器中去使用
app.use(session({
  secret:'这是加密字符串，随便写啊哈哈哈',//用来生成加密的内容
  resave:false,
  saveUninitialized:false
}));

// var indexRouter = require('./router/indexRouter');
// app.use(indexRouter);
// var userRouter = require('./router/userRouter');
// app.use(userRouter);
// app.use(require('./router/indexRouter'));
// app.use(require('./router/userRouter'));
// 导入自定义的路由，并注册
fs.readdir(path.join(__dirname,'./router'),(err,filenames)=>{
  if(err) throw err;
  filenames.forEach(filename => {
    var filePath = path.join(__dirname,'./router',filename);
    app.use(require(filePath));
  });
});

app.listen(3003,function(){
  console.log('http://127.0.0.1:3003');
});