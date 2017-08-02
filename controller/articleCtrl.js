var articleModel = require('../model/articleModel.js');

var mditor = require('mditor');


module.exports = {
  showArticlePage(req,res){
    //1.在展示添加页面前，先判断当前用户有没有登录，
    // 如果登录则跳转登录页
    // 为啥要判断有没有登录：因为每一篇文章都对应唯一的作者，如果没有登录，就无法获取作者id
    if(!req.session.islogin) return res.redirect('/login');
    // 2.如果检查之后，，发现登录了，那么就直接渲染 文章添加页面
    
    res.render('./article/add',{
      islogin:req.session.islogin,
      user:req.session.user
    });
  },
  addNewArticle(req,res){//发表文章
    //1.获取到提交过来的数据 req.body
    var article = req.body;
    // console.log(article);
    article.ctime = new Date();
    //2.调用model里面中相关的方法，将文章数据保存到数据中
    articleModel.addNewArticle(article,(err,results)=>{
      if(err || results.affectedRows != 1) return res.json({err_code:1,msg:'发表文章失败！请稍后再试'});
      // 发表ok
      // console.log(results);
      res.json({err_code:0,id:results.insertId});
    });
  },
  showInfoPage(req,res){//展示文章详情页面
    // 获取提交过来的文章id
    var id  = req.query.id;
    articleModel.getArticleById(id,(err,results)=>{
      if(err || results.length !==1) return res.redirect('/');
      //创建一个 把 MarkDown 格式解析为 HTML 格式的对象 
      var parser = new mditor.Parser();
      results[0].content =  parser.parse(results[0].content);

      res.render('./article/info',{
        article:results[0],
        islogin:req.session.islogin,
        user:req.session.user
      });
    });
  },
  showEditPage(req,res){//展示 文章编辑页面
    // 先判断用户是否登录，如果没有，则直接 跳转到 登录页面
    if(!req.session.islogin) return res.redirect('/login');
    //1.获取到编辑这篇文章的id
    articleModel.getArticleById(req.query.id,(err,results)=>{
      if(err || results.length !== 1) return res.redirect('/');
      // 在展示页面之前，要确保。登录人的 ID 和 当前文章作者id相同才能渲染页面
      if(req.session.user.id !== results[0].authorid) return res.redirect('/');
      //展示编辑页面
      res.render('./article/edit',{
        islogin:req.session.islogin,
        user:req.session.user,
        article:results[0]
      });
    });
    // 2.调用 model 中相关的方法， 获取到  这篇文章
    // 3.展示 编辑页面 并渲染原始的文章数据到页面中
  },
  editArticle(req,res){
    // 获取要提交上来的编辑过的文章信息
    var article = req.body;
    // console.log(article);
    articleModel.editArticle(article,(err,results)=>{
      if(err || results.affectedRows !==1) return res.json({err_code:1,msg:'编辑失败'});
      res.json({err_code:0});
    });

  }
  

}