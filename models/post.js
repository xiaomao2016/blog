var Join = require('mongo-join').Join,
	mongodb = require('./db'),
	markdown = require('markdown').markdown,
	util=require('./../libs/util.js');
	//require('./javascripts/dateFormat.js');

function Post(username, post, time,title,id,pv,postType,category) {
	this.user = username;
	this.post = post;
	if (time) {
		var date = new Date(time+8*60*60*1000);//appfog 比当前时间早8小时
        this.time=util.format_date(date,true);
		/*this.time = {
	      date: date,
	      year : date.getFullYear(),
	      month : date.getFullYear() + "-" + ((date.getMonth()+1+'').length==1?'0'+(date.getMonth()+1):(date.getMonth()+1)),
	      day : date.getFullYear() + "-" + ((date.getMonth()+1+'').length==1?'0'+(date.getMonth()+1):(date.getMonth()+1)) + "-" + ((date.getDate()+'').length==1?'0'+date.getDate():date.getDate()),
	      minute : date.getFullYear() + "-" + ((date.getMonth()+1+'').length==1?'0'+(date.getMonth()+1):(date.getMonth()+1)) + "-" + ((date.getDate()+'').length==1?'0'+date.getDate():date.getDate()) + " " + ((date.getHours()+'').length==1? '0'+ date.getHours():date.getHours()) + ":" + ((date.getMinutes()+'').length==1? '0'+date.getMinutes():date.getMinutes()),
	      second : date.getFullYear() + "-" + ((date.getMonth()+1+'').length==1?'0'+(date.getMonth()+1):(date.getMonth()+1)) + "-" + ((date.getDate()+'').length==1?'0'+date.getDate():date.getDate()) + " " + ((date.getHours()+'').length==1? '0'+ date.getHours():date.getHours()) + ":" + ((date.getMinutes()+'').length==1? '0'+date.getMinutes():date.getMinutes())+":"+((date.getSeconds()+'').length==1?'0'+date.getSeconds():date.getSeconds())
  		};*/
	} else {
		this.time=new Date().getTime();//存储的时间格式为时间戳
	}
	this.title=title;
	this.id=id;
	this.pv=pv;
    this.postType=postType;//1代表转载，2代表原创
	this.category=category;
};
module.exports = Post;

Post.prototype.save = function save(callback) {
	// 存入 Mongodb 的文檔
	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
		title:this.title,
		pv:0,
        postType:this.postType,
		category:this.category
	};
	mongodb.open(function (err,db) {
		if (err) {
		  return callback(err);
		}
		
		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//collection.ensureIndex('user',{w: 0});
			collection.insert(post, {safe: true}, function (err, doc) {
				mongodb.close();
				var content = new Post(doc[0].user, doc[0].post, doc[0].time,doc[0].title,doc[0]._id);
				//insert回调函数返回的是数组,即使结果只有一个，所以用doc[0]
				callback(err, content);
			});
		});
	});
};
Post.edit=function(post,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var BSON = require('mongodb').BSONPure;
            collection.update({"_id":new BSON.ObjectID(post.id+'')},
                {$set:{post:post.post,title:post.title,postType:post.postType,category:post.category,modifyTime:this.time}},{upsert:true},function(){
                    mongodb.close();
                    callback(null);
                });
        });
    });
}
Post.getHot9 = function get(callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {
				time:{$gte:util.getWeekFirstDay(),$lte:util.getWeekLastDay()}
            };

			collection.find(query, {limit:9}).sort({pv: -1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv);
					posts.push(post);
				});

				callback(null, posts);
			});
		});
	});
};

Post.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
	
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//查找user属性为username的文档，如果username为null则匹配全部
			var query = {};
			if (username) {
				query.user = username;
			}

			collection.find(query,function(err,cursor){
				var join=new Join(db).on({
		    		field:'user',
		    		to:'name',
		    		from:'users'
		    	});
		    	join.toArray(cursor,function(err,docs){
		    		mongodb.close();
					var posts = [];
					docs.forEach(function(doc, index) {
						var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv);
						posts.push(post);
					});

					callback(null, posts.reverse());
		    	});
			});

			/*collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				mongodb.close();

				if (err) {
					callback(err, null);
				}

				var posts = [];
				
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv);
					posts.push(post);
				});

				callback(null, posts);
			});*/
		});
	});
};

Post.getTen = function(name, page, callback) {//一次获取十五篇文章
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.user = name;
      }

	    //使用 count 返回总文档数 total
	    collection.count(query,function(err,total){
	    	collection.find(query,{skip:(page-1)*15,limit:15,sort:{time:-1}},function(err,cursor){
	    		var join=new Join(db).on({
	    			field:'user',
	    			to:'name',
		    		from:'users'
	    		});
	    		join.toArray(cursor,function(err,docs){
		    		mongodb.close();
					var posts = [];
					docs.forEach(function(doc, index) {
						var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv);
						posts.push(post);
					});

					callback(null, posts,total);
		    	});
	    	});
	    });
	    /*collection.count(function(err, total){
	        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的10个结果
	        collection.find(query,{skip:(page-1)*10,limit:10}).sort({
	          time: -1
	        }).toArray(function (err, docs) {
	          mongodb.close();
	          if (err) {
	            callback(err, null);//失败！返回 null
	          }
	          //解析 markdown 为 html
	          docs.forEach(function(doc){
	            doc.post = markdown.toHTML(doc.post);
	          });  
	          callback(null, docs, total);
	        });
      	});*/
    });
  });
};
  //isreplyorpost  判断是否是在回复帖子或者发表帖子或者管理员查看时调用此方法  如果是， pv不用加1
Post.getOne=function(id,isreplyorpost,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection('posts',function(err,collection){
			if (err) {
		        mongodb.close();
		        return callback(err);
      		}
      		//ObjectID = require('mongodb').ObjectID,
      		var BSON = require('mongodb').BSONPure;
		   // var obj_id = BSON.ObjectID.createFromHexString(id);
		    //nodejs里面把mongodb的id转化为ObjectID
		    //console.log(new BSON.ObjectID(id));
		    var join=new Join(db).on({
		    		field:'user',
		    		to:'name',
		    		from:'users'
		    });
		    join.findOne(collection,{"_id":new BSON.ObjectID(id+'')},function(err,doc){
      			if (err) {
         			callback(err, null);
        		}
        		if(doc){
        			doc.post = markdown.toHTML(doc.post);
        		}
                if(!isreplyorpost)
                {
                    //每访问1次，pv 值增加1
                    collection.update({"_id":new BSON.ObjectID(id+'')},{$inc:{"pv":1}},function(err, result){
                        mongodb.close();
                        var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv,doc.postType,doc.category);
                        callback(null, post,id);//返回特定查询的文章
                    });
                } else{
                    mongodb.close();
                    var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv,doc.postType,doc.category);
                    callback(null, post,id);//返回特定查询的文章
                }
      		});



      		/*collection.findOne({"_id":new BSON.ObjectID(id)},function(err,doc){
      			if (err) {
         			callback(err, null);
        		}
        		if(doc){
        			doc.post = markdown.toHTML(doc.post);
        		}
        		//每访问1次，pv 值增加1
      			collection.update({"_id":new BSON.ObjectID(id)},{$inc:{"pv":1}},function(err, result){
			        mongodb.close();
			        callback(null, doc,id);//返回特定查询的文章
      			}); 
      		});*/    		
		});
	});
}

Post.getPostsByCategoryId=function(id,page,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection('posts',function(err,collection){
			if (err) {
				mongodb.close();
				return callback(err);
			};
            collection.count({category:id},function(err,total){
                collection.find({category:id},{skip:(page-1)*10,limit:10,sort:{time:-1}},function(err,cursor){
                    var join=new Join(db).on({
                        field:'user',
                        to:'name',
                        from:'users'
                    });
                    join.toArray(cursor,function(err,docs){
                        mongodb.close();
                        var posts = [];
                        docs.forEach(function(doc, index) {
                            var post = new Post(doc.user, doc.post, doc.time,doc.title,doc._id,doc.pv);
                            posts.push(post);
                        });

                        callback(null, posts,total);
                    });
                });
            });
		});
	});
}

Post.getPostCountsByCategoryIds=function(callback){
    mongodb.open(function(err,db){
        if (err) {
            return callback(err);
        };
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.group(['category'],{}, {"count":0}, "function (obj, prev) { prev.count++; }",function(err,results){
                mongodb.close();
                if (err) {
                    return callback(err);
                };
                callback(results);
            });
        });
    });
}

Post.delete=function(id,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        };
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var BSON = require('mongodb').BSONPure;
            collection.remove({"_id":new BSON.ObjectID(id+'')},function(){
                mongodb.close();
                callback(null);
            })
        });
    });
}