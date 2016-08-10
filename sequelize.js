/**
 * Created by itsx02 on 2016/8/3.
 */
var Sequelize=require('sequelize');
//相关配置
var sequelize=new Sequelize('sequelize','root','',
    {
        host:'127.0.0.1',
        port:'3306',
        dialect:'mysql',
        "timezone": "+08:00",//时区设置，如果不设置，时间会比实际的少8小时
        "pool": {
            "max": 15,
            "min": 0,
            "idle": 10000
        }
    }
);
// 定义一个表
var Task = sequelize.define('Task', {
    // auto increment, primaryKey, unique
    id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

    // comment
    title : {type : Sequelize.STRING, comment : 'Task title'},

    // allow null
    description : {type : Sequelize.TEXT, allowNull : true},

    // default value
    deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});
/*
 事件处理
 通过 sync 方法同步模型到数据库
 */
/*Task.sync().then(function () {
 console.log('created success...');
 }).catch(function () {
 console.log('created error...');
 })*/
//使用原始sql语句进行查询
/*sequelize.query('select * from tasks where title="标题"').spread(function(res){
    console.log(res);
});*/
/*sequelize.query('select * from tasks where title=?',{ replacements: ['标题'],
    type: sequelize.QueryTypes.SELECT }).then(function (result) {
    console.log(result);
})*/
/*sequelize.query('select * from tasks where title=:title',{ replacements: {title:'标题'},
    type: sequelize.QueryTypes.SELECT }).then(function (result) {
    console.log(result);
})*/
// 添加一条记录
/*
Task.build({title : 'test_title_3', 'description' : 'test_description_3'}).save().then(function (info) {
    console.log(info);
}).catch(function (err) {
    console.error(err);
});*/
//另一种添加记录的方法
/*Task.create({title : '新标题', 'description' : '新内容'}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
})*/
//批量插入数据
/*Task.bulkCreate([
    {title : '新', 'description' : '新内容'},
    {title : '标', 'description' : '新内容'},
{title : '题', 'description' : '新内容'}
], { validate: true }).catch(function(errors) {

});*/
//删除一条记录
/*Task.destroy({where:{id : '4'}}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/
//修改一条记录
/*Task.update({description : '修改修改'}, {where:{id : '2'}}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/
//查询所有记录
/*Task.findAll({limit : 10, order : 'id desc',raw:true}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/
//事务示例代码
sequelize.transaction({autocommit:1,isolationLevel:'SERIALIZABLE'}).then(function (t) {
    Task.findAll().then(function (result) {
        t.commit();
        console.log('已经提交');
    });
}).then(function (result) {
    console.log('返回结果'+result);
}).catch(function (err) {
    console.error(err);
})

//查询一条记录
/*Task.findOne({where:{set:6},attributes: ['id','deadline'],raw:true}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error('error....');
});*/
// 统计数量
/*Task.count({where : {title : '标题'}}, {logging : false}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/
// 获取最大/最小值
/*Task.max('id').then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/
//另外一些常用函数
/*Model.find({
    where: {
        attr1: {
            gt: 50
        },
        attr2: {
            lte: 45
        },
        attr3: {
            in: [1,2,3]
        },
        attr4: {
            ne: 5
        }
    }
})  */
/*Model.find({
    where: Sequelize.and(
        { name: 'a project' },
        Sequelize.or(
            { id: [1,2,3] },
            { id: { gt: 10 } }
        )
    )
})  */


