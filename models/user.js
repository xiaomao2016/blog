var mongodb = require('./db');

function User(user) {
    this.uid = user._id;
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.imgPath = user.imgPath;
    this.active = user.active;
    this.role=user.role;//1为管理员，2为普通会员
};
module.exports = User;

User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
        email: this.email,
        imgPath: this.imgPath,
        active: this.active,
        role:2
    };
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 为 name 属性添加索引
            //collection.ensureIndex('name', {unique: true},{w: 0});
            // 写入 user 文档
            collection.insert(user, {safe: true}, function (err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};


User.get = function get(username, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 查找 name 属性为 username 的文档
            collection.findOne({name: username,active:true}, function (err, doc) {
                mongodb.close();
                if (doc) {
                    // 封装文档为 User 对象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

User.getAll=function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.find().toArray(function(err,docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,docs);
            })
        })

    });
}
User.updateActiveAccount = function(callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            collection.save({_id:this.uid,active:true},function(err,result){
                mongodb.close();
                callback(err);
            });
        });
    });
}
User.updateImg = function updateImg(user, imgPath, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            collection.update({"name": user.name}, {$set: {"imgPath": imgPath}}, function (err, result) {
                mongodb.close();
                var newUser = {
                    name: user.name,
                    password: user.password,
                    imgPath: imgPath
                };
                callback(null, newUser);//返回特定查询的文章
            });
        });
    })
}
