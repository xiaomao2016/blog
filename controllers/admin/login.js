var crypto = require('crypto');
var User = require('../../models/user.js');
exports.adminIndex=function(req,res){
    res.render('admin/main', {
        layout: 'adminlayout',
        title: '后台管理',
        user:req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
}

exports.adminLogin=function(req, res){
    res.render('admin/login', {
        layout:null,
        title: '后台登陆',
        user:req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
};

exports.doAdminLogin=function(req,res){
    var  md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    User.get(req.body.username,function(err,user){
        if(!user){
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.name!='xiao') {
            req.flash('error','您没有后台登陆权限');
            return res.redirect('/');
        };
        if(user.password!=password){
            req.flash('error','用户口令错误');
            return res.redirect('/login');
        }
        req.session.user=user;
        req.flash('success','登入成功');
        res.redirect('/admin/main');
        /*		res.render('admin/category', {
         layout:'mainlayout',
         title: '分类管理',
         user:req.session.user,
         success : req.flash('success').toString(),
         error : req.flash('error').toString()
         });*/
        //res.redirect('/admin/category');
    });
}
