var Join = require('mongo-join').Join,
	mongodb=require('./db'),
	markdown = require('markdown').markdown,
	user=require('./user'),
	BSON = require('mongodb').BSONPure,
	Util=require('../libs/util');

function Comment(postId,name,comment,commentId,time,user,id,replies2){
	this.postId=postId;
	this.name=name;
	this.comment=comment;
	this.commentId=commentId;//回复父ID
	//存储各种时间格式，方便以后扩展
	if(time)
	{
        var date = new Date(time+8*60*60*1000);//appfog 比当前时间早8小时
        this.time=Util.format_date(date,true);
		/*this.time = {
		      date: date,
		      year : date.getFullYear(),
		      month : date.getFullYear() + "-" + (date.getMonth()+1),
		      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes(),
		      second : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds()
	  		}*/
  	}
  	this.user=user;
  	this.id=id;
  	this.replies2=replies2;

}
module.exports=Comment;

Comment.prototype.save=function(uid,callback){
	// 存入 Mongodb 的文檔
	//console.log(uid);
	
	var comment = {
		postId: this.postId,
		name: this.name,
		comment: this.comment,
		commentId:this.commentId,
		upid:new require('mongodb').DBRef('users',new BSON.ObjectID(uid))
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('comments',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(comment,{safe:true},function(err, comment){
				mongodb.close();
				callback(err, comment);
			});
		});
	});
}

Comment.prototype.subSave=function(uid,parentName,callback){
	// 存入 Mongodb 的文檔
	
	var comment = {
		postId: this.postId,
		name: this.name,
		comment: this.comment,
		commentId:this.commentId,
		parentName:parentName,
		upid:new require('mongodb').DBRef('users',new BSON.ObjectID(uid))
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('comments',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(comment,{safe:true},function(err, comment){
				mongodb.close();
				callback(err, comment);
			});
		});
	});
}

var getItemCreateTime = function(objectId){
    var str = objectId.toString().slice(0,8);
    var time = parseInt(str,16) * 1000;
    return time;
  }
Comment.getAllComment=function(postId,callback){
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		var comments=[];
		db.collection('comments',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
		      if (postId) {
		        query.postId = postId;
		    }
		    collection.find(query,function(err,cursor){
		    	var join=new Join(db).on({
		    		field:'name',
		    		to:'name',
		    		from:'users'
		    	});

		    	join.toArray(cursor,function(err,replies){
		    		mongodb.close();
		    		var replies2 = [];
      				//执行完第一个for循环，得到一级回复数组replies,和二级回复数组replies2
				      for (var i = replies.length - 1; i >= 0; i--) {
				        if (replies[i].commentId) {
				          replies2.push(replies[i]);
				          replies.splice(i, 1);
				        }
				      }
				      //
				      for (var j = 0; j < replies.length; j++) {
				        replies[j].replies = [];
				        for (var k = 0; k < replies2.length; k++) {
				          var id1 = replies[j]._id;//一级回复ID
				          var id2 = replies2[k].commentId;//二级回复的父ID
				          replies2[k].time=Util.getItemCreateTime(replies2[k]._id);
				          if (id1.toString() === id2.toString()) {
				            replies[j].replies.push(replies2[k]);//将属于一级回复的子回复加入到一级回复的replies中
				          }
				        }
				        replies[j].replies.reverse();//颠倒数组中元素的顺序
				      }
		    		replies.forEach(function(doc){
		    			var comment=new Comment(doc.postId,doc.name.name,markdown.toHTML(doc.comment),doc.commentId,getItemCreateTime(doc._id),doc.name,doc._id,doc.replies);
						comments.push(comment);
		    		});
		    		callback(null,comments);
		    	});
		    });
		});


		/*db.collection('users',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find({},function(err,items){
				items.toArray(function(err,arrays){
				var len=arrays.length;
				var result=[];
				var usernames=[];
				for(var i=0;i<len;i++){
					var array=arrays[i];
					var name=array.name;
					usernames.push(name);
				}
				var op={name:{$in:usernames}};
					db.collection('comments',function(err,collection2){
						if(err){
							mongodb.close();
							return callback(err);
						}
						collection2.find({postId:postId},function(err,cdata){
							cdata.toArray(function(err,carray){
								carray.forEach(function(doc){
									console.log(doc.name);
									console.log(arrays);
									console.log(arrays[doc.name+'']);
									var comment=new Comment(doc.postId,doc.name,markdown.toHTML(doc.comment),doc.commentId,getItemCreateTime(doc._id),arrays[doc.name].imgPath);
									comments.push(comment);
								});
							});
						});
					});
				});
			});
			
			
		});*/
		//db.users.find({},{},







		/*db.collection('comments',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
		      if (postId) {
		        query.postId = postId;
		      }



			collection.find(query).sort({time:-1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err,null);
				}

				var comments=[];
				var count=0;
				 docs.forEach(function(doc){

				 	console.log(doc.upid);
				 	console.log(doc.upid.oid);
				 	if(doc){
				 		db.collection(doc.upid.namespace);
				 		db[doc.upid.namespace].findOne({"_id":new BSON.ObjectID(doc.upid.oid+'')},function(err,result){
				 			console.log(result);
				 		});  






				 		user.get(doc.name,function(err,user){
				 			if(err){
								return callback(err,null);
							}
							count++;
							var comment=new Comment(doc.postId,doc.name,markdown.toHTML(doc.comment),doc.commentId,getItemCreateTime(doc._id),user);
            				//doc.comment = markdown.toHTML(doc.comment);
            				//getItemCreateTime(doc._id);
            				console.log(comment);
            				comments.push(comment);
            				console.log('dsfsdfsdf');
            				if(count==docs.length){
					 			console.log('222222');
					 			callback(null,comments);
				 			}
				 		});
				 		console.log('222222');
				 		
				 	}

          		}); 
          		
			});
		});*/
	});
}