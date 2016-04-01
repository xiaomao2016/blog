/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-10-9
 * Time: 下午4:00
 * To change this template use File | Settings | File Templates.
 */
var Category=require('../../models/category.js');
var Post=require('../../models/post.js');
exports.category=function(req,res){
    Category.get(function(docs){
        res.render('admin/category', {
            layout:'adminlayout',
            title: '分类管理',
            user:req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            categories:docs
        });
    });
}

exports.doCategoryAdd=function(req,res){
    var newCategory=new Category(req.body.categoryName,req.body.categoryImgName,req.body.categoryDesc);
    newCategory.save(function(err,doc){
        if (err) {
            req.flash('error',err);
            return res.redirect('/admin/category');
        };
        req.flash('success','添加成功');
        res.redirect('/category');
    });
}

