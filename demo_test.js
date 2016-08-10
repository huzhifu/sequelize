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
//User的实例对象将拥有getUserCheckin、setUserCheckin、addUserCheckin方法
User.hasOne(UserCheckin);
//UserCheckin的实例对象将拥有getUser、setUser、addUser方法
UserCheckin.belongsTo(User);

//建立1：N模型关系
//User的实例对象将拥有getAddress、setAddress、addAddress、createAddress、removeAddress、hasAddress方法(这里都要用到UserAddress的别名Address)
User.hasMany(UserAddress,{foreignKey:'user_id',targetKey:'id',as:'Address'});
//UserAddress的实例对象将拥有getUser、setUser、createUser方法
UserAddress.belongsTo(User);

var UserRoles = sequelize.define('UserRoles',
    {
        type: {
            type: sequelize.constructor.INTEGER(),
            allowNull: false
        }
    },{
        underscored: false,

    }
);


//建立N:M模型关系
// User的实例拥有getUserRoles、setUserRoles、addUserRole、addUserRoles、createUserRoles、removeUserRoles、hasUserRoles方法
User.belongsToMany(Role,{through:'UserRoles',as:'UserRoles'});
//Role的实例拥有getUserRoles、setUserRoles、addUserRole、addUserRoles、createUserRoles、removeUserRoles、hasUserRoles方法
Role.belongsToMany(User,{through:'UserRoles',as:'UserRoles'});

/*
* 以上的UserRoles是自己指定名称，系统会默认在这个表中生成两个字段：user_id和role_id这两个字段都是主键
* 当然也可以不使用系统默认生成的表，自定义一个model,如下：
*var UserRoles = sequelize.define('UserRoles',
 {
 'user_id': {
 type: DataTypes.BIGINT(11),
 primaryKey: true,
 unique: true,
 comment:'主键'
 },
 'role_id':{
 type: DataTypes.BIGINT(11),
 primaryKey: true,
 unique: true,
 comment:'主键'
 }
 }
 );
 然后将该model名称放到through:和as：后面
* */
//同步到数据库中
sequelize.sync().then(function () {
    console.log('created success');
}).catch(function () {
    console.log('created failed');
});
//////////////////////////////////////////一对一///////////////////////////////////////////////////
/*1:1关系模型中的增加操作*/
/*User.create({username:'li',password:'123456'}).then(function (user) {
    user.createUserCheckin({loginIp: '127.0.0.2'});
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
/*User.create({username:'gu',password:'123456'}).then(function (user) {
    UserAddress.create({'userId':user.get({'plain': true}).id,'consignee': '1','address':'1','zipCode':'1','tel':'1'});
    // user.createAddress({'consignee': '1','address':'1','zipCode':'1','tel':'1'}); //无效
    // user.addAddress(userAddress);                                                 //无效
}).catch(function (err) {
    console.error(err);
});*/

/*1:N关系模型中的查询操作*/
/*User.findOne({where:{id:1}}).then(function (user) {
    user.getAddress({raw:true}).then(function (addresses) {
        console.log(addresses);
    }).catch(function (err) {
        console.error(err);
    })
}).catch(function (err) {
    console.error(err);
});*/
//另外一种查询方法                            //无效
/*User.findById(1,{
    'include':[UserAddress]
}).then(function (user) {
    console.log(user.get({'plain': true}));
});*/
/*1:N关系模型中的删除操作*/
/*User.findOne({where:{id:3}}).then(function (user) {
    user.setAddress([]);
}).catch(function (err) {
    console.error(err);
});*/
/*1:N关系模型中的修改操作*/
/*User.findOne({where:{id:1}}).then(function (user) {
    UserAddress.findOne({where:{id:3}}).then(function (address) {
        user.setAddress([address]);
    });
}).catch(function (err) {
    console.error(err);
});*/
//////////////////////////////////////////多对多///////////////////////////////////////////////////
/*N:M关系模型中的增加操作*/
/*User.create({username:'li',password:'123456'}).then(function (user) {
 user.createUserRole({roleName:'管理员'},{'type': 0});
 console.log('数据插入成功！');
 }).catch(function (err) {
 console.error(err);
 });*/
/*User.create({username:'li',password:'123456'}).then(function (user) {
    Role.create({roleName:'admin'}).then(function (role) {
        user.addUserRole(role,{type:1});
    });
}).catch(function (err) {
    console.error(err);
});*/
/*N:M关系模型中的修改操作*/
/*User.findOne({where:{id:20}}).then(function (user) {
    Role.findOne({where:{id:17}}).then(function (role) {
         user.setUserRoles([role],{type:5});
    })
}).catch(function (err) {
    console.error(err);
});*/
/*N:M关系模型中的删除操作*/
/*User.findOne({where:{id:20}}).then(function (user) {
    Role.findOne({where:{id:17}}).then(function (role) {
        user.removeUserRole(role);
    })
}).catch(function (err) {
    console.error(err);
});*/
//全部删除
/*User.findOne({where:{id:21}}).then(function (user) {
    user.setUserRoles([]);
}).catch(function (err) {
    console.error(err);
});*/
/*N:M关系模型中的查询操作*/
/*User.findOne({where:{id:22}}).then(function (user) {
    user.getUserRoles({raw:true}).then(function (results) {
        console.log(results);
    });
}).catch(function (err) {
    console.error(err);
});*/
/*User.findOne({                                                //无效
    'include': [
        {
            'model': UserRoles
        }
    ],
    where:{id:22}
}).then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.error(err);
});*/



