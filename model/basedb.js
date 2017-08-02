var mysql = require('mysql');
var connection = mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'rout',
  database:'blog0728',
  multipleStatements:true//开启执行多条sql语句的功能
});

module.exports = connection;
