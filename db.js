/**
 * sequelize实践最佳版
 */
var Sequelize=require('sequelize');
// var sequelize = new Sequelize('mysql://root:@127.0.0.1:3306/login');//另外一种连接数据库的方法
var sequelize=new Sequelize('login','root','',
    {
      host:'127.0.0.1',
        port:'3306',
        dialect:'mysql',
        timezone:'+08:00',
        pool:{
            max:15,
            min:0,
            idle:10000
        }
    });
exports.sequelize=sequelize;
