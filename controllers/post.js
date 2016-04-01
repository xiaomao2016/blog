/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-10-9
 * Time: 下午2:32
 * To change this template use File | Settings | File Templates.
 */

var Post=require('../models/post.js');
var Comment=require('../models/comment.js');
var Category=require('../models/category.js');

exports.post = function(req, res) {
    var currentUser = req.session.user;
    var post = req.body.post ;
    res.render('post',{
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString(),
        post:post,
        title:post.title
    });
};

exports.postOne = function(req, res) {
    var isreplyorpost = req.query.view ? true : false;//管理员查看文章时，浏览数不加1；
    Post.getOne(req.query.id,isreplyorpost,function(err,post,id){
        if (err) {
            req.flash('error',err);
            return res.redirect('/');
        };
        Comment.getAllComment(req.query.id,function(err,comments){
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('post',{
                user : req.session.user,
                success : req.flash('success').toString(),
                error : req.flash('error').toString(),
                post:post,
                title:post.title,
                comments:comments,
                postId:id,
                categoryname:req.query.categoryname,
                categoryid:req.query.categoryid,
                flag:req.query.flag
            });
        });
    });
};

exports.doPost = function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post,null,req.body.title,'',0,req.body.optionsRadios,req.body.category);
    post.save(function(err,post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        //res.redirect('/u/' + currentUser.name);
        Post.getOne(post.id+'',true,function(err,post,id){
            if (err) {
                req.flash('error',err);
                return res.redirect('/');
            };
            res.render('post',{
                user : req.session.user,
                success : req.flash('success').toString(),
                error : req.flash('error').toString(),
                post:post,
                title:post.title,
                comments:[],
                postId:post.id,
                categoryid:req.body.category,
                categoryname:req.body.categoryname,
                flag:req.body.flag
            });
        });
    });
};
exports.allPosts = function (req, res) {
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Post.getTen(null, page, function (err, posts, total) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        };
        res.render('allPosts', {
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            title: '全部文章',
            posts: posts,
            totals: total,
            page: page,
            categoryid:null,
            categoryname:null
        });
    });
};
exports.individualPosts=function(req,res){
    var page=req.query.p?parseInt(req.query.p):1;
    Post.getTen(req.session.user.name, page, function (err, posts, total) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        };
        res.render('myHome', {
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString(),
            title: '我的空间',
            posts: posts,
            totals: total,
            page: page,
            categoryid:null,
            categoryname:null
        });
    });
}
exports.categoryShow=function(req,res){
    var page = req.query.p?parseInt(req.query.p):1;
    Post.getPostsByCategoryId(req.query.categoryid,page,function(err,docs,total){
        if (err) {
            return res.redirect('/');
        };
        res.render('category', {
            title: req.query.categoryname,
            user:req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            categoryid:req.query.categoryid,
            categoryname: req.query.categoryname,
            posts:docs,
            page:page,
            totals:total
        });
    });
}
//发表帖子
exports.say=function(req,res){
    var flag=req.query.flag?2:null;
    Category.get(function(docs){
        res.render('say',{
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            title:'发表帖子',
            categoryid:req.query.categoryid,
            categoryname:req.query.categoryname,
            categories:docs,
            flag:flag
        });
    });
}
//打开编辑帖子
exports.postView=function(req,res){
    var isreplyorpost = req.query.view ? true : false;//管理员查看文章时，浏览数不加1；
    Post.getOne(req.query.id,isreplyorpost,function(err,post,id){
        if (err) {
            req.flash('error',err);
            return res.redirect('/');
        };
        Comment.getAllComment(req.query.id,function(err,comments){
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            Category.get(function(docs){
                res.render('postUpdate',{
                    user : req.session.user,
                    success : req.flash('success').toString(),
                    error : req.flash('error').toString(),
                    post:post,
                    title:post.title,
                    comments:comments,
                    postId:id,
                    categories:docs,
                    categoryid:post.category,
                    page:req.query.p
                });
            });
        });
    });
}
//编辑帖子提交
exports.doPostUpdate=function(req,res){
    var post=new Post(req.session.user,req.body.post,null,req.body.title,req.body.postID,0,req.body.optionsRadios,req.body.category);
    Post.edit(post,function(err){
        if(err){
            req.flash('error','err');
            return;
        }
        req.flash('success','修改成功！');
        res.redirect('/myHome?p='+req.body.page);
    })
}
//删除帖子
exports.postDelete=function(req,res){
    Post.delete(req.query.id,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/myHome?p='+req.query.p);
        }
        req.flash('success','删除成功！');
        res.redirect('/myHome?p='+req.query.p);
    })
}