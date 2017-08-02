# blog-0728

## 搭建博客案例基本结构并渲染首页

- 把MVC结构搭建起来

## 用户注册模块的实现

## 用户登录模块的实现

## 登录密码MD5加密存储的实现

### 为什么要对密码进行加密处理

在现实生活中，很多人多个账号公用一个密码，那么假如账号信息和个人信息被泄露，那么就存在个人信息和财产受到威胁的情况！
为了防止用户密码被泄露之后，很容易就被非法分子看到原始的密码，我们需要对用户的密码进行加密后再存储！
明文：将原密码实际的存储到数据库中可以直接查看用户的原始密码；
密文：就是将密码，加密之后再保存到数据中，这样存储方式，能有提高密码的安全性，就算数据库中的密码不小心被泄露了，非法分子，也无法直接获取到用户的原密码！

### 什么是MD5加密

MD5的全称是Message-Digest Algorithm 5（信息-摘要算法），在90年代初由MIT Laboratory for Computer Science和RSA Data Security Inc的Ronald L. Rivest开发出来，经MD2、MD3和MD4发展而来。
MD5加密的特性：

- MD5加密后输出的是`32位长度的字符串`
- 相同的内容使用MD5加密后，得到的内容是一致的
- MD5加密后的字符串是无法通过算法的形式反向解密的（唯一的破解方式是暴力碰撞破解）
- 为了防止暴力碰撞破解，我们可以对需要加密的内容，进行**加盐处理**

> 什么是加盐处理：就是在需要加密的文本内容，和一串长且复杂的文本进行拼接，这样就能防止加密后的MD5值被暴力碰撞破解。
> 为什么要加盐加密：就是为了防止用户的密码过于简单，然后我们程序通过加盐，提高了密码的复杂性，这样能够保证用户信息的安全！

### 在Express中使用MD5加密

1. 运行以下命令安装MD5加密模块：

```
npm install blueimp-md5 -S
```

1. 使用方式：

```
var hash = md5("value", "key");
```

## HTTP协议的无状态性

1. HTTP协议的通信模型：基于`请求 - 处理 - 响应`的！
2. 由于这个通信协议的关系，导致了HTTP每个请求之间都是没有关联的，每当一个请求完成之后，服务器就忘记之前谁曾经请求过！
3. 如果纯粹基于HTTP通信模型，是无法完成登录状态保持的！每次请求服务器，服务器都会把这个请求当作新请求来处理！
4. 我们可以通过 cookie 技术，实现状态保持，但是由于cookie是存储在客户端的一门技术，所以安全性几乎没有，因此不要使用cookie存储敏感的数据！

## cookie介绍

### 什么是cookie，作用是什么

- 由于**Http协议是无状态**的，且传统服务器**只能被动的响应请求**，所以，当服务器获取到请求的时候，并不知道当前请求属于哪个客户端！
- 服务器为了能够明确区分每个客户端，需要使用一些小技术，来根据不同的请求区分不同的客户端；
- 只要有请求发生，那么必然对应一个客户端，那么，我们可以在每次客户端发起请求的时候，向服务器自动发送一个标识符，告诉服务器当前是哪个客户端正在请求服务器的数据；
- 如何提供这个标识符呢？我们可以在请求头(Request Headers)中添加一个标签，叫做`cookie`，这样，每次发送请求，都会把这个cookie随同其他报文一起发送给服务器，服务器可以根据报文中的cookie，区分不同的客户端浏览器。
- 如何在客户端请求头中添加标识符？


- 在Node中可以在`writeHeader`的时候，通过`Set-Cookie`来将cookie标识通过响应报文发送给客户端！
- 客户端也可以通过一些方式来操作自己的cookie，比如通过`jquery.cookie`这个插件！

### cookie的基本使用

```
var http = require('http');

var server = http.createServer();

server.on('request', function (req, res) {
    // 解析cookie
    var cookies = {};
    var cookieStr = req.headers.cookie; // 从请求的headers中获取cookie信息
    cookieStr && cookieStr.split(';').forEach(function (item) {
        var parts = item.split('=');
        cookies[parts[0].trim()] = parts[1].trim(); // 将cookie解析出来，保存到对象中
    });

    res.writeHeader(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        "Set-Cookie": ['issend=ok', 'age=20']
    });

    if(cookies.issend ==='ok'){
        res.end('不要太贪心哦！');
    }else{
        res.end('呐，赏你一朵小红花~~');
    }
});

server.listen(4000, function () {
    console.log('服务器已启动!');
});
```

### 通过`expires`设置Cookie的过期时间

```
// 设置 过期时间 为60秒之后
// 注意：在设置过期时间的时候，需要将时间转换为 UTC 格式
var expiresTime = new Date(Date.now() + 1000 * 60).toUTCString();
res.writeHeader(200, {
  'Content-Type': 'text/html; charset=utf-8',
  'Set-Cookie': ['isvisit=true;expires=' + expiresTime, 'test=OK']
});
res.end('<h3>你好，欢迎光临，送给你一个苹果！</h3>');
```

### cookie可以被伪造，不安全

使用谷歌插件`edit this cookie`，就能伪造cookie数据！所以不要使用cookie存储敏感的数据！比如登录状态和登录信息；
一些敏感的数据，应该存储都服务器端！

## 登录退出及状态保存

### 使用`express-session`来保存登录状态

#### 什么是session

由于HTTP是无状态的，所以服务器在每次连接中持续保存客户端的私有数据，此时需要结合cookie技术，通过session会话机制，在服务器端保存每个HTTP请求的私有数据；

#### session原理

在服务器内存中开辟一块地址空间，专门存放每个客户端私有的数据，每个客户端根据cookie中保存的私有sessionId，可以获取到独属于自己的session数据。

#### 在express中使用session

1. 安装session模块

```
npm install express-session -S
```

1. 导入session模块

```
var session = require('express-session')
```

1. 在express中使用`session`中间件：

```
// 启用 session 中间件
app.use(session({
  secret: 'keyboard cat', // 相当于是一个加密密钥，值可以是任意字符串
  resave: false, // 强制session保存到session store中
  saveUninitialized: false // 强制没有“初始化”的session保存到storage中
}))
```

1. 将私有数据保存到当前请求的session会话中：

```
// 将登录的用户保存到session中
req.session.user = result.dataValues;
// 设置是否登录为true
req.session.islogin = true;
```

1. 通过`destroy()`方法清空`session`数据：

```
req.session.destroy(function(err){
  if(err) throw err;
  console.log('用户退出成功！');
  res.redirect('/');
});
```

## 注销功能的实现

## 使用模板引擎处理公共部分

## 添加文章并跳转到文章详情

## 完成文章编辑功能

## 首页文章列表渲染和处理相对时间

## 使用Sql语句进行联表查询

## 首页文章列表分页功能的实现

## 相关文章

1. [node.js中express-session配置项详解](http://blog.csdn.net/liangklfang/article/details/50998959)
2. [MD5在线生成器1](http://www.cmd5.com/)
3. [MD5在线生成器2](http://pmd5.com/)
4. [JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5)