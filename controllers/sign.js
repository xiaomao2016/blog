
/*
 * GET users listing.
 */
var User = require('../models/user.js');
var crypto = require('crypto');
var validate=require("../libs/validate.js");
var mail=require("../services/mail.js") ;
var nodemailer = require('nodemailer');
var settings=require("../settings.js");
exports.reg = function(req, res) {
    res.render('reg', {
        title: '用户注册',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString(),
        name:null,
        email:null
    })};
exports.doReg = function(req, res) {
    var email=req.body.email;
    arr=validate.checkEmpty(req.body.username,"用户名")  ;
    if(arr && arr[1]){
        req.flash('error',arr[0]);
        res.render('reg',{
            title: '用户注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            name:req.body.username
        });
        return;
    }
    arr=validate.checkInterval(req.body.username,"用户名",4,8)  ;
    if(arr && arr[1]){
        req.flash('error',arr[0]);
        res.render('reg',{
            title: '用户注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            name:req.body.username
        });
        return;
    }
    arr=validate.checkEmpty(req.body.password,"密码")  ;
    if(arr && arr[1]){
        req.flash('error',arr[0]);
        return res.redirect('/reg');
    }
    arr=validate.checkInterval(req.body.password,"密码",4,8)  ;
    if(arr && arr[1]){
        req.flash('error',arr[0]);
        return res.redirect('/reg');
    }
    if(req.body['password-repeat']!=req.body['password'])
    {
        //alert('两次输入的口令不一致');
        req.flash('error','两次输入的口令不一致');
        return res.redirect('/reg');
    }
    arr=validate.checkEmpty(req.body.email,"邮箱地址")  ;
    if(arr && arr[1]){
        req.flash('error',arr[0]);
        res.render('reg',{
            title: '用户注册',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            name:req.body.username,
            email:email
        });
        return;
    }
    var md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    var newUser=new User({
        name:req.body.username,
        password:password,
        email:email,
        imgPath:'default.png',
        active:false
    });

    User.get(newUser.name,function(err,user){
        //console.log(newUser.name);
        if(user)
        {
            err='用户名已存在';
        }
        if(err){
            req.flash('error',err);
            return res.redirect('/reg');
        }
        newUser.save(function(err,user){
            if(err)
            {
                req.flash('error',err);
                return res.redirect('/reg');
            }
            mail.sendActiveMail(email,crypto.createHash('md5').update(email+settings.cookieSecret).digest('base64'),req.body.username);
            res.render('reg',{
                title: '用户注册',
                user:req.session.user,
               //success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                name:null,
                email:null ,
                success: '欢迎加入筱站！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
            });
            /*req.session.user=user[0];
            req.flash('success','注册成功');
            res.redirect('/');*/
        });
    });
};

exports.active_account=function(req,res,next){
    var key=req.query.key;
    var name=req.query.name;
    User.get(name,function(err,user){
         if(err){
             return next(err);
         }
         if(!user || crypto.createHash('md5').update(user.email+settings.cookieSecret).digest('base64')!==key){
             return res.render('reg', {
                 title: '用户注册',
                 user:null,
                 //success:req.flash('success').toString(),
                 error: '信息有误，帐号无法被激活。',
                 name:null,
                 email:null ,
                 success:null
             });
         }
        if(user.active){
            return res.render('reg', {
                title: '用户注册',
                user:null,
                //success:req.flash('success').toString(),
                error: '帐号已经是激活状态。',
                name:null,
                email:null ,
                success:null
            });
        }else if(user.active===false){
            user.active=true;
            user.updateActiveAccount(function(err){
                if(err){
                    return next(err);
                }
                res.render('login',{
                    title: '用户注册',
                    user:null,
                    //success:req.flash('success').toString(),
                    error:null,
                    success:'帐号已被激活，请登录'});
            });
        }
        
    });
};

exports.login = function(req, res) {
    res.render('login', {
        title:'用户登录',
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
};
exports.doLogin = function(req, res) {
    var  md5=crypto.createHash('md5');
    var password=md5.update(req.body.password).digest('base64');
    User.get(req.body.username,function(err,user){
        if(!user){
            req.flash('error', '用户不存在或邮箱账号未激活');
            return res.redirect('/login');
        }
        if(user.password!=password){
            req.flash('error','用户口令错误');
            return res.redirect('/login');
        }
        req.session.user=user;
        //console.log(user);
        req.flash('success','登入成功');
        res.redirect('/');
    });
};
exports.logout = function(req, res) {
    req.session.user=null;
    req.flash('success','登出成功！');
    res.redirect('/');
};