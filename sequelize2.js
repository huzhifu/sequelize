/**
 * Created by itsx02 on 2016/8/5.
 */
var Sequelize=require('sequelize');
//这是连接数据库的另外一种方法
var sequelize = new Sequelize('mysql://root:@127.0.0.1:3306/test');
sequelize
    .authenticate()
    .then(function(err) {
        console.log('连接成功！.');
    })
    .catch(function (err) {
        console.log('连接失败:', err);
    });
// 定义一个表
var test = sequelize.define('test', {
    //取消时间戳
    timestamps: false,//如果设置为true，则会自动添加updatedAt, createdAt属性
    // 不从数据库中删除数据，而只是增加一个 deletedAt 标识当前时间
    // paranoid 属性只在启用 timestamps 时适用
    paranoid: true,
    underscored: true,// 不使用驼峰式命令规则，这样会在使用下划线分隔
    freezeTableName: true,//禁止修改表名
    tableName: 'tt',//重定义表名
    // auto increment, primaryKey, unique
    id : {type : Sequelize.UUID,  primaryKey : true, unique : true},

    // comment
    // title : {type : Sequelize.STRING, comment : 'Task title'},

    // allow null
    description : {type : Sequelize.TEXT, allowNull : true},

    // default value
    // deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});
/*test.findOne({raw:true}).then(function (task) {  //增删改查之后都返回一个Promise
    console.log(task['id']);
})*/

