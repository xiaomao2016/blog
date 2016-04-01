/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-10-9
 * Time: 下午2:54
 * To change this template use File | Settings | File Templates.
 */
exports.checkLogin=function(req,res,next){
    if(!req.session.user)
    {
        req.flash('error','未登入');
        return res.redirect('/login');
    }
    next();
}

exports.checkNotLogin=function(req,res,next){
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}

//需要管理员权限
exports.checkAdmin=function(req,res,next){
    if(!req.session.user){
        req.flash('error','未登入');
        return res.redirect('/admin');
    }
    if(req.session.user.role==2)
    {
        req.flash('error','没有管理员权限');
        return res.redirect('/');
    }
    next();
}
