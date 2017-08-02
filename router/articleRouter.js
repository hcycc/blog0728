var express = require('express');
var router = express.Router();
// 导入文章controller
var articleCtr = require('../controller/articleCtrl.js');

router
  .get('/article/add',articleCtr.showArticlePage)//获取添加页面
  .post('/article/add',articleCtr.addNewArticle)//发表新文章
  .get('/article/info',articleCtr.showInfoPage)//展示文章详情页面
  .get('/article/edit',articleCtr.showEditPage)//展示编辑页面
  .post('/article/edit',articleCtr.editArticle)//编辑文章

module.exports = router;