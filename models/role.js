/**
 * Created by 99999904 on 13-12-5.
 */
var mongodb = require('./db');

function Role(roleId, roleName) {
    this.roleId = roleId;
    this.roleName = roleName;
}
module.exports = Role;

Role.save = function (callback) {
    var role = {
        roleId: this.roleId,
        roleName: this.roleName
    }
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('roles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.insert(role, {safe: true}, function (err, role) {
                mongodb.close();
                callback(err, role);
            });
        })
    });
}

Role.get = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('roles', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(docs);
            });
        });
    });
}
