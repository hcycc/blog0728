var connection = require('./basedb.js');

var moment = require('moment');
moment.locale('zh-cn');

module.exports = {
  addNewArticle(article,callback){//添加新文章数据
    var sqlStr = 'insert into articles set ?';
    connection.query(sqlStr,article,(err,results)=>{
      if(err) return callback(err);
      callback(null,results);
    })
  },
  getArticleById(id,callback){
    var sqlStr = 'select articles.*,users.nickname from articles left join users on articles.authorid = users.id where articles.id = ?';
    connection.query(sqlStr,id,(err,results)=>{
      if(err) return callback(err);
      // console.log(results);
      results.forEach(article=>{
        article.ctime = moment(article.ctime).format('YYYY-MM-DD HH:mm:ss');
      });
      callback(null,results);
    }); 
  },
  editArticle(article,callback){
    var sqlStr = 'update articles set ? where id = ?'
    connection.query(sqlStr,[article,article.id],(err,results)=>{
      if(err) return callback(err);
      callback(null,results);
    });
  },
  getArticlesByPage(nowPage,pageSize,callback){//先获取所有的文章列表，然后在改造 成获取分页
    var offset = (nowPage-1)*pageSize;

    var sqlStr = 'select articles.*,users.nickname from articles left join users on articles.authorid = users.id order by ctime desc limit ?,?;select count(*) as totalCount from articles';
    connection.query(sqlStr,[offset,pageSize],(err,results)=>{
      // console.log(results);

      results[0].forEach(item=>{
        // item.ctime = moment(item.ctime).format('YYYY-MM-DD HH:mm:ss');
        item.ctime = moment(item.ctime).fromNow();
      });
      callback(null,results);
    });
    
  }
}