/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-10-9
 * Time: 下午3:50
 * To change this template use File | Settings | File Templates.
 */
var Post=require('../models/post.js');
var Comment=require('../models/comment.js');

exports.doComment=function(req,res){
    var currentUser = req.session.user;
    var Id;
    if(req.body.commentId)
    {
        Id=req.body.commentId;
    }else{
        Id=null;
    }
    var comment = new Comment(req.body.postId,currentUser.name,req.body.comment,Id,null,currentUser);
    comment.save(currentUser.uid,function(err,comment) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '回复成功');
        //console.log(req.body.postId);
        Post.getOne(req.body.postId,true,function(err,post,id){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }

            Comment.getAllComment(req.body.postId,function(err,comments){
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('post',{
                    comments:comments,
                    post:post,
                    user:currentUser,
                    success : req.flash('success').toString(),
                    error : req.flash('error').toString(),
                    postId:id,
                    title:post.title,
                    flag:req.body.flag,
                    categoryid:req.body.categoryid,
                    categoryname:req.body.categoryname
                });
            });
        })

        //res.redirect('/u/' + currentUser.name);

    });
}

exports.doComment2=function(req,res){
    var currentUser = req.session.user;
    var Id;
    if(req.body.commentId)
    {
        Id=req.body.commentId;
    }else{
        Id=null;
    }
    var comment = new Comment(req.body.postId,currentUser.name,req.body.comment,Id,null,currentUser);
    //console.log(req.body.parentName2);
    comment.subSave(currentUser.uid,req.body.parentName2,function(err,currentUser) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '回复成功');
        //console.log(req.body.postId);
        Post.getOne(req.body.postId,true,function(err,post,id){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }

            Comment.getAllComment(req.body.postId,function(err,comments){
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('post',{
                    comments:comments,
                    post:post,
                    user:currentUser,
                    success : req.flash('success').toString(),
                    error : req.flash('error').toString(),
                    postId:id,
                    title:post.title,
                    flag:req.body.flag,
                    categoryid:req.body.categoryid,
                    categoryname:req.body.categoryname
                });
            });
        })

        //res.redirect('/u/' + currentUser.name);

    });
}
