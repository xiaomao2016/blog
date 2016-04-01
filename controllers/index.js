
/*
 * GET home page.
 */

var User = require('../models/user.js');
var Post=require('../models/post.js');
var Category=require('../models/category.js');

var WishingWall=require('../models/wishingWall.js');

var gm = require('gm')
,	fs = require('fs')
,	imageMagick = gm.subClass({ imageMagick : true });


function getImageNameDate(date){
	var Y = date.getFullYear();
	var M = date.getMonth()+1;
	if (M < 10) M = '0' + M;
	var D = date.getDate();
	if (D < 10) D = '0' + D;
	var h = date.getHours();
	if (h < 10) h = '0' + h;
	var m = date.getMinutes();
	if (m < 10) m = '0' + m;
	var s = date.getSeconds();
	if (s < 10) s = '0' + s;
	return (Y+M+D+h+m+s);
}

exports.index = function(req, res){
	Post.getHot9(function(err, hotPosts) {
		if (err) {
			posts = [];
		}
        Post.getTen(null,1,function(err,topTen,totals){
            Category.get(function(docs){
                Post.getPostCountsByCategoryIds(function(results){
                    for(var i=0;i<docs.length;i++)  {
                        for(var j=0;j<results.length;j++)   {
                            if((docs[i].cid+'')==results[j].category)
                            {
                                docs[i].cnum=results[j].count;
                            }
                        }
                    }
                    res.render('index', {
                        title: '首页',
                        hotPosts : hotPosts,
                        topTen:topTen,
                        user : req.session.user,
                        success : req.flash('success').toString(),
                        error : req.flash('error').toString(),
                        categories:docs
                    });
                });
            });
        });

	});
};





exports.user=function(req,res){
	var page = req.query.p?parseInt(req.query.p):1;
	User.get(req.params.user,function(err,user){
		if(!user)
		{
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		/*Post.get(user.name,function(err,posts){
			if (err) {
				req.flash('error',err);
				return res.redirect('/');
			};
			res.render('user',{
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString(),
				title:user.name,
				posts:posts
			});
		});*/
		Post.getTen(user.name,page,function(err,docs,total){
			if (err) {
				req.flash('error',err);
				return res.redirect('/');
			};
			res.render('user',{
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString(),
				title:user.name,
				posts:docs,
				totals:total,
				page:page
			});

		});
	});
};

exports.wishingWall=function(req,res){
	WishingWall.getAllContent(function(err,docs){
			res.render('wishingWall',{
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString(),
				title:'许愿墙',
				ww:docs,
				count:docs.length
			});
		});
}

exports.doWishingWall=function(req,res){
	var currentUser = req.session.user;
	var wish=new WishingWall(currentUser.name,req.body.wwContent);
	wish.save(function(err){
		if(err){
			req.flash('error', err);
			return res.redirect('/');
		}
		WishingWall.getAllContent(function(err,docs){
			res.render('wishingWall',{
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString(),
				title:'许愿墙',
				ww:docs,
				count:docs.length
			});
		});
	});
}

exports.sounds=function(req,res){
	res.render('sounds',{
		title:'sounds',
		user:req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
	});
}

exports.headPortraitUpload=function(req, res){
	res.render('headPortraitUpload',{
		title:'上传头像',
		user:req.session.user,
		success : req.flash('success').toString(),
		error : req.flash('error').toString()
	});
}

exports.doHeadPortraitUpload=function(req, res){

   // 获得文件的临时路径
    var tmp_path = req.files.image.path;
    var sz = req.files.image.size;
    var tmp = req.files.image.type.split('/');
	var imgType = tmp[1];
	var imgAllType="jpeg,png,gif";
	if(imgAllType.indexOf(imgType)<0)
	{
		req.flash("error","图片格式不支持");
		fs.unlink(tmp_path, function() {	//fs.unlink 删除用户上传的文件
			res.render('headPortraitUpload',{
				title:'上传头像',
				user:req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	}
    if (sz > 2*1024*1024) {
    	req.flash("error","上传头像不能大于2M");
		fs.unlink(tmp_path, function() {	//fs.unlink 删除用户上传的文件
			res.render('headPortraitUpload',{
				title:'上传头像',
				user:req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString()
			});
		});
	}
	var imgName=getImageNameDate(new Date());
    // 指定文件上传后的目录 - 示例为"images"目录。 
    var target_path = './public/images/user/' + imgName+'.'+imgType;
    var readStream = fs.createReadStream(tmp_path);
    var writeStream = fs.createWriteStream(target_path);
    
    readStream.pipe(writeStream);
    fs.unlink(tmp_path, function(err) {
         	if (err) throw err;
            User.updateImg(req.session.user,imgName+'.'+imgType,function(err,newUser){
				if(err){
					return res.redirect('/');
				}
				req.session.user.imgPath=imgName+'.'+imgType;
				res.render('headPortraitUpload',{
					title:'上传头像',
					user:req.session.user,
					success : req.flash('success').toString(),
					error : req.flash('error').toString()
				});

			});
         	//res.send('File uploaded to: ' + target_path + ' - ' + req.files.image.size + ' bytes');
      });
    /*util.pump(readStream, writeStream, function() {
        fs.unlinkSync(tmp_path);
        console.log('55555');
    });*/


    /*// 移动文件
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(tmp_path, function() {
         if (err) throw err;
         res.send('File uploaded to: ' + target_path + ' - ' + req.files.image.size + ' bytes');
      });
    });*/
}

exports.showImgUpload = function(req, res){
	//获取user文件夹里的所有文件名
	fs.readdir('public/images/user', function(err, files){
		res.render('imgUpload', { title: '上传头像'
							, time: (new Date()).getTime()
							, files: files,
							user:req.session.user,
							success : req.flash('success').toString(),
							error : req.flash('error').toString()
		});
	});
};
exports.DoImgUpload = function(req, res) {
	res.header('Content-Type', 'text/plain');
	var currentUser = req.session.user;
	var path = req.files.img.path;	//获取用户上传过来的文件的当前路径
	var sz = req.files.img.size;
	var tmp = req.files.img.type.split('/');
	var imgType = tmp[1];
	if (sz > 2*1024*1024) {
		fs.unlink(path, function() {	//fs.unlink 删除用户上传的文件
			res.end('1');
		});
	} else if (tmp[0] != 'image') {
		fs.unlink(path, function() {
			res.end('2');
		});
	} else {
		/*exec('rm -r public/images/user', function(err){
			if (err) {
				console.log(err);
				res.end();
			}*/
			fs.exists('public/images/user',function(result){
				if(!result){
					fs.mkdir('public/images/user', function(err){
						if (err) {
							console.log(err);
							res.end();
						}
					});
				}else{
					var imgName=getImageNameDate(new Date());
					var originImg = imageMagick(path);
					originImg.resize(250, 250, '!') //加('!')强行把图片缩放成对应尺寸250*250！
					.autoOrient()
					.write('public/images/user/'+imgName+'.'+imgType, function(err){
						if (err) {
							console.log(err);
							res.end();
						}
						originImg.resize(150, 150, '!') //强行把图片缩放成对应尺寸150*150！
						.autoOrient()
						.write('public/images/user/2'+imgName+'.'+imgType, function(err){
							if (err) {
								console.log(err);
								res.end();
							}
							originImg.resize(100, 100, '!') //强行把图片缩放成对应尺寸250*250！
							.autoOrient()
							.write('public/images/user/3'+imgName+'.'+imgType, function(err){
								if (err) {
									console.log(err);
									res.end();
								}
								originImg.resize(50, 50, '!') //强行把图片缩放成对应尺寸50*50！
								.autoOrient()
								.write('public/images/user/4'+imgName+'.'+imgType, function(err){
									if (err) {
										console.log(err);
										res.end();
									}
									fs.unlink(path, function() {
										User.updateImg(currentUser,imgName+'.'+imgType,function(err,newUser){
											if(err){
												return res.end('3');
											}
											req.session.user.imgPath=imgName+'.'+imgType;
										});
										return res.end('3');
									});
								});
							});
						});
					});
				}
			});
			/*fs.mkdir('public/images/user', function(err){
				if (err) {
					console.log(err);
					res.end();
				}
				
			})*/
		//});
	}
};
