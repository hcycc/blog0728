/**
 * Created by hcy on 2017/7/28.
 */
var ArticleModel = require('../model/articleModel.js');

module.exports = {
    showIndexPage(req, res) { // 渲染首页页面
        // 在渲染首页的时候，先获取到所有的文章列表，交给首页渲染
        // 当前页码值
        var nowPage = parseInt(req.query.page) || 1;
        // 每页显示的记录条数
        var pageSize = 2;
        // 根据页码和pageSize 查询数据
        ArticleModel.getArticlesByPage(nowPage,pageSize,(err, results) => {
            if (err) return res.send('500.服务器内部错误！');
            var totalCount = results[1][0]['totalCount'];
            var totalPage = Math.ceil(totalCount/pageSize);
            res.render('index', {
                islogin: req.session.islogin, //从session中获取用户是否登陆
                user: req.session.user, //从session中获取数据
                list:results[0],//所有文字数
                totalPage:totalPage,
                nowPage:nowPage
            });
        });

    }
}