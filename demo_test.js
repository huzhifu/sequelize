/**
 * Created by itsx02 on 2016/8/9.
 */
var db=require('./db');
var role=require('./role');
var user=require('./user'); 
var userAddress=require('./userAddress');
var userCheckin=require('./userCheckin');
var sequelize=db.sequelize;
sequelize.authenticate().then(function () {
    console.log('connected success!');
}).catch(function(err){
    console.error('connected error',err);
});
var Role=role(sequelize,sequelize.constructor);
var User=user(sequelize,sequelize.constructor);
var UserAddress=userAddress(sequelize,sequelize.constructor);
var UserCheckin=userCheckin(sequelize,sequelize.constructor);
//建立1:1模型关系
User.hasOne(UserCheckin);
UserCheckin.belongsTo(User);
//建立1：N模型关系
User.hasMany(UserAddress,{foreignKey:'user_id',targetKey:'id',as:'Address'});
//建立N:M模型关系
User.belongsToMany(Role,{through:'userRoles',as:'UserRoles'});
Role.belongsToMany(User,{through:'userRoles',as:'UserRoles'});
//同步到数据库中
sequelize.sync().then(function () {
    console.log('created success');
}).catch(function () {
    console.log('created failed');
});
//////////////////////////////////////////一对一///////////////////////////////////////////////////
/*1:1关系模型中的增加操作*/
/*User.create({username:'hu',password:'123456'}).then(function (user) {
    user.createUserCheckin({loginIp: '127.0.0.1'});
    console.log('数据插入成功！');
}).catch(function (err) {
    console.error(err);
});*/
/*1:1关系模型中的修改操作*/
/*User.findOne({where:{id:10}}).then(function (user) {
    var userCheckin = UserCheckin.build({loginIp: '128.0.0.1'});
    user.setUserCheckin(userCheckin);
}).catch(function (err) {
    console.error('error....');
});*/
/*1:1关系模型中的删除操作(仅仅是切断它们之间的联系)*/
/*User.findOne({where:{id:10}}).then(function (user) {
    user.setUserCheckin(null);
}).catch(function (err) {
    console.error('error....');
});*/
/*1:1关系模型中的查询操作*/
/*User.findOne({where:{id:10}}).then(function (user) {
    return user.getUserCheckin();
}).then(function (result) {
    console.log(result.get({'plain': true}));//去除冗余数据
}).catch(function (err) {
    console.error('error....');
});*/
//另外一种查询操作
/*User.findById(10,{
    'include':[UserCheckin]
}).then(function (user) {
    console.log(user.get({'plain': true}));
});*/
//////////////////////////////////////////一对多///////////////////////////////////////////////////
/*1:N关系模型中的增加操作*/
User.create({username:'gu',password:'123456'}).then(function (user) {
    user.createAddress({'consignee': '1','address':'1','zip_code':'1','tel':'1'});
}).catch(function (err) {
    console.log('操作失败！');
    console.error(err);
});






