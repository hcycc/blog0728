/**
 * Created by hcy on 2017/7/28.
 */
var connection = require('../model/basedb.js');
module.exports = {
  getUserByName(name,callback){//根据用户名查找指定用户是否存在
    var sqlStr = 'select * from users where username = ?'; 
    connection.query(sqlStr,name,(err,results)=>{
      // console.log(results);
      if(err) return callback(err);
      callback(null,results);
    });
  },
  registerNewUser(user,callback){
    var sqlStr = 'insert into users set ?';
    connection.query(sqlStr,user,(err,results)=>{
      if(err) return callback(err);
      callback(null,results);
    });

  },
  loginUser(user,callback){
    var sqlStr = 'select * from users where username = ? and password = ?';
    connection.query(sqlStr,[user.username,user.password],(err,results)=>{
      // console.log(results);
      if(err) return callback(err);
      callback(null,results);
    });

  }
}


