

var index=require('./controllers/index.js'),
    about=require('./controllers/about.js'),
    sign=require('./controllers/sign.js'),
    auth=require('./middlewares/auth.js'),
    post=require('./controllers/post.js'),
    comment=require('./controllers/comment.js'),
    category=require('./controllers/admin/category.js'),
    adminLogin=require('./controllers/admin/login.js'),
    user=require('./controllers/user.js');
module.exports=function(app){

    app.get('/reg',auth.checkNotLogin,sign.reg);
    app.post('/reg',auth.checkNotLogin,sign.doReg);
    app.get('/login',auth.checkNotLogin,sign.login);
    app.post('/login',auth.checkNotLogin,sign.doLogin);
    app.get('/logout',auth.checkLogin,sign.logout);
    app.get('/active_account', sign.active_account);

    //关于本站
    app.get('/introduction',about.introduction);
    app.get('/linkOurs',about.linkOurs);
    app.get('/adService',about.adService);
    app.get('/copyright',about.copyright);


	app.get('/', index.index);
	app.get('/u/:user', index.user);

	app.get('/post',post.post);
	app.get('/postOne',post.postOne);
	app.post('/post',auth.checkLogin,post.doPost);
    app.get('/allPosts',post.allPosts);
    app.get('/categoryShow',post.categoryShow);
    app.get('/say',post.say);//发表帖子
    app.get('/postUpdate',post.postView);//编辑帖子
    app.post('/postUpdate',post.doPostUpdate);

    //我的空间
    app.get('/myHome',post.individualPosts);
    app.get('/postDelete',post.postDelete);

    app.post('/comment',auth.checkLogin,comment.doComment);
    app.post('/comment2',auth.checkLogin,comment.doComment2);

	app.get('/wishingWall',index.wishingWall);
	app.post('/wishingWall',auth.checkLogin,index.doWishingWall);



	app.get('/sounds',index.sounds);
	app.get('/imgUpload',index.showImgUpload);
	app.post('/imgUpload', index.DoImgUpload);
	app.get('/headPortraitUpload',index.headPortraitUpload);
	app.post('/headPortraitUpload',index.doHeadPortraitUpload);


	app.get('/admin',adminLogin.adminLogin);
	app.post('/admin',adminLogin.doAdminLogin);
    app.get('/admin/main',auth.checkAdmin,adminLogin.adminIndex);
    app.get('/admin/userManage',auth.checkAdmin,user.getAllUsers);

    app.get('/category',category.category);
    app.post('/category',category.doCategoryAdd);



};