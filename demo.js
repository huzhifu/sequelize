/**
 * Created by itsx02 on 2016/8/8.
 */
// 相关模块引入
var db=require('./db.js');
var user=require('./user.js');
var userCheckin=require('./userCheckin.js');
var userAddress=require('./userAddress.js');
var role=require('./role.js');
//创建sequelize对象
var sequelize=db.sequelize;
// 测试连接是否成功
sequelize.authenticate()
    .then(function () {
        console.log('连接数据库成功！！');
    })
    .catch(function (err) {
        console.error('连接失败：',err);
    });

// 创建user模型
var User=user(sequelize,sequelize.constructor);

// 创建userCheckin模型
var UserCheckin=userCheckin(sequelize,sequelize.constructor);

// 创建userAddress模型
var UserAddress=userAddress(sequelize,sequelize.constructor);

// 创建role模型
var Role=role(sequelize,sequelize.constructor);


/*建立模型关系*/
User.hasOne(UserCheckin);
UserCheckin.belongsTo(User);
//在hasMany()方法中通过foreignKey和targetKey来指定关联关系(主外键关系)，指定后该关系同样会被同步到数据库中
User.hasMany(UserAddress,{foreignKey:'user_id',targetKey:'id',as:'Address'});
//as选项，该选项表示“别名”，目标模型会混入到源模型后会使用该名称
User.belongsToMany(Role,{through:'userRoles',as:'UserRoles'});
Role.belongsToMany(User,{through:'userRoles',as:'UserRoles'});


/*
// 通过 sync 方法同步模型到数据库
User.sync().then(function () {
    console.log('created success...');
}).catch(function () {
    console.log('created error...');
});
// 通过 sync 方法同步模型到数据库
UserCheckin.sync().then(function () {
    console.log('created success...');
}).catch(function () {
    console.log('created error...');
});
// 通过 sync 方法同步模型到数据库
UserAddress.sync().then(function () {
    console.log('created success...');
}).catch(function () {
    console.log('created error...');
});
// 通过 sync 方法同步模型到数据库
Role.sync().then(function () {
    console.log('created success...');
}).catch(function () {
    console.log('created error...');
});*/
sequelize.sync().then(function () {
    console.log('created success...');
}).catch(function () {
    console.log('created error...');
});
//单独插入数据
/*Promise.all([User.create({
    username: 'itbilu',
    password: 'itbilu.com'
}), Role.create({roleName: '管理员'})]).then(function (results) {
    console.log(results[0].dataValues);
    console.log('以上是user===========以下是role');
    console.log(results[1].dataValues);

}).catch(function (err) {
    console.error(err);
});*/
//关联模型插入数据（1:1关系模型）
User.create({username: 'itbilu', password: 'itbilu.com'}).then(function (user) {
    var userCheckin = UserCheckin.build({loginIp: '127.0.0.1'});
    user.setUserCheckin(userCheckin);
    console.log('插入数据成功！');
}).catch(function (err) {
    console.error(err);
});
//关联模型插入数据（N:M关系模型）
Promise.all([User.create({
    username: 'itbilu',
    password: 'itbilu.com'
}), Role.create({roleName: '管理员'})]).then(function (results) {
    var user = results[0];
    var role = results[1];
    user.setUserRoles(role);
    // 或 //
    role.setUserRoles(user);
}).catch(function (err) {
    console.error(err);
});
//连接查句(1:1关系)
User.findOne({include: [UserCheckin]}).then(function (user) {
    console.log(user);
}).catch(function (err) {
    console.error(err);
});
//连接查询语句（1:N或N:M）
User.findOne().then(function (user) {
    user.getAddress();
    console.log(user);
}).catch(function (err) {
    console.error(err);
});
//更新语句（1:1）
User.findOne({include: [UserCheckin]}).then(function (user) {
    var userCheckin = UserCheckin.build({userId: user.id, loginIp: '192.168.0.1'});
    user.setUserCheckin(userCheckin);
    console.log(user);
}).catch(function (err) {
    console.error(err);
});
/*User.findAll({
    include: [{
        model: Project,
        through: {
            attributes: ['createdAt', 'startedAt', 'finishedAt'],
            where: {completed: true}
        }
    }]
});*/
//删除语句（）
User.destroy({where: {id: 2}}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});
// 使用模型实例删除
User.findOne().then(function(user){
    user.destroy();
}).catch(function (err) {
    console.error(err);
});







