/**
 * Created by 99999904 on 14-2-21.
 */
exports.introduction=function(req,res){
    res.render('introduction',{
        title:'简介',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}
exports.linkOurs=function(req,res){
    res.render('linkOurs',{
        title:'联系我们',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}
exports.adService=function(req,res){
    res.render('adService',{
        title:'广告服务',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}
exports.copyright=function(req,res){
    res.render('copyright',{
        title:'版权声明',
        user:req.session.user,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
    });
}

