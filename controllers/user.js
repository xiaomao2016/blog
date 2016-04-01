var User=require('../models/user.js');

exports.getAllUsers=function(req,res){
    User.getAll(function(err,users){
        if(err){
            req.flash('error',err);
            return;
        }
        res.render('admin/userlist',{
            layout:'adminlayout',
            title:'用户管理',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            users:users
        })
    });
}
