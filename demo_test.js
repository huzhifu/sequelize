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

// 方法2

var user = yield User.create({'emp_id': '1'});
var note = yield Note.create({'title': 'b'});
yield user.addNote(note);
//修改：
// 为user增加note1、note2
var user = yield User.create({'emp_id': '1'});
var note1 = yield user.createNote({'title': 'a'});
var note2 = yield user.createNote({'title': 'b'});
// 先创建note3、note4
var note3 = yield Note.create({'title': 'c'});
var note4 = yield Note.create({'title': 'd'});
// user拥有的note更改为note3、note4
yield user.setNotes([note3, note4]);

//删除
var user = yield User.create({'emp_id': '1'});
var note1 = yield user.createNote({'title': 'a'});
var note2 = yield user.createNote({'title': 'b'});
yield user.setNotes([]);
// 还有一个真正的删除方法，就是removeNote。如下所示：
yield user.removeNote(note);
//查询
var notes = yield user.getNotes({
    'where': {
        'title': {
            '$like': '%css%'
        }
    }
});
notes.forEach(function(note) {
    console.log(note);
});
/*情况2

查询所有满足条件的note，同时获取note属于哪个user。*/
var notes = yield Note.findAll({
    'include': [User],
    'where': {
        'title': {
            '$like': '%css%'
        }
    }
});
notes.forEach(function(note) {
    // note属于哪个user可以通过note.user访问
    console.log(note);
});
/*情况3

查询所有满足条件的user，同时获取该user所有满足条件的note。*/
var users = yield User.findAll({
    'include': [Note],
    'where': {
        'created_at': {
            '$lt': new Date()
        }
    }
});
users.forEach(function(user) {
    // user的notes可以通过user.notes访问
    console.log(user);
});
//多对多关系
//增
var note = yield Note.create({'title': 'note'});
yield note.createTag({'name': 'tag'}, {'type': 0});

//方法2
var note = yield Note.create({'title': 'note'});
var tag = yield Tag.create({'name': 'tag'});
yield note.addTag(tag, {'type': 1});
//方法3
var note = yield Note.create({'title': 'note'});
var tag1 = yield Tag.create({'name': 'tag1'});
var tag2 = yield Tag.create({'name': 'tag2'});
yield note.addTags([tag1, tag2], {'type': 2});
//修改操作
// 先添加几个tag
var note = yield Note.create({'title': 'note'});
var tag1 = yield Tag.create({'name': 'tag1'});
var tag2 = yield Tag.create({'name': 'tag2'});
yield note.addTags([tag1, tag2], {'type': 2});
// 将tag改掉
var tag3 = yield Tag.create({'name': 'tag3'});
var tag4 = yield Tag.create({'name': 'tag4'});
yield note.setTags([tag3, tag4], {'type': 3});

//删
// 先添加几个tag
var note = yield Note.create({'title': 'note'});
var tag1 = yield Tag.create({'name': 'tag1'});
var tag2 = yield Tag.create({'name': 'tag2'});
var tag3 = yield Tag.create({'name': 'tag2'});
yield note.addTags([tag1, tag2, tag3], {'type': 2});

// 删除一个
yield note.removeTag(tag1);

// 全部删除
yield note.setTags([]);
//查询操作

//情况1查询note所有满足条件的tag。
var tags = yield note.getTags({
    //这里可以对tags进行where
});
tags.forEach(function(tag) {
    // 关系模型可以通过tag.tagging来访问
    console.log(tag);
});
/*情况2

查询所有满足条件的tag，同时获取每个tag所在的note。*/
var tags = yield Tag.findAll({
    'include': [
        {
            'model': Note
            // 这里可以对notes进行where
        }
    ]
    // 这里可以对tags进行where
});
tags.forEach(function(tag) {
    // tag的notes可以通过tag.notes访问，关系模型可以通过tag.notes[0].tagging访问
    console.log(tag);
});
/*情况3

查询所有满足条件的note，同时获取每个note所有满足条件的tag。*/

var notes = yield Note.findAll({
    'include': [
        {
            'model': Tag
            // 这里可以对tags进行where
        }
    ]
    // 这里可以对notes进行where
});
notes.forEach(function(note) {
    // note的tags可以通过note.tags访问，关系模型通过note.tags[0].tagging访问
    console.log(note);
});
