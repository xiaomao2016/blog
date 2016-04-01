var mongodb = require('./db');
	markdown = require('markdown').markdown;

function WishingWall(username,content,date){
	this.name=username;
	this.content=content;
	//存储各种时间格式，方便以后扩展
	if(date)
	{
		this.time = {
		      date: date,
		      year : date.getFullYear(),
		      month : date.getFullYear() + "-" + (date.getMonth()+1),
		      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes(),
		      second : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds()
	  		}
  	}
}

module.exports=WishingWall;

WishingWall.prototype.save = function(callback) {
	// 存入 Mongodb 的文檔
	var wishWall={
		name:this.name,
		content:this.content
	}
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("wishWalls",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(wishWall,{safe:true},function(err, wishWall){
				mongodb.close();
				callback(err, wishWall);
			});
		});
	});
};

var getItemCreateTime = function(objectId){
    var str = objectId.toString().slice(0,8);
    var time = parseInt(str,16) * 1000;
    return new Date(time);
  }

WishingWall.getAllContent=function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('wishWalls',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			collection.find(query).sort({time:-1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err,null);
				}
				var ww=[];
				docs.forEach(function(doc){
					if(doc){
						var wishwall=new WishingWall(doc.name,markdown.toHTML(doc.content),getItemCreateTime(doc._id));
						ww.push(wishwall);
					}
				});
				callback(null, ww);

			});
		});
	});
}