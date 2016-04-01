var mongodb=require('./db');

function Category(cid,cname,cimgname,cdesc,cnum){
    this.cid=cid;
	this.cname=cname;
	this.cimgname=cimgname;
	this.cdesc=cdesc;
    this.cnum=cnum;
}
module.exports=Category;
Category.prototype.save=function save(callback){
	var category={
		cname:this.cname,
		cimgname:this.cimgname,
		cdesc:this.cdesc
	};
	mongodb.open(function(err,db){
		if (err) {
			return callback(err);
		};
		db.collection('categorys',function(err,collection){
			if (err) { 
				mongodb.close();
				return callback(err);
			};
			collection.insert(category,{safe:true},function(err,doc){
				mongodb.close();
				callback(err,doc);
			});

		});
	});
}

Category.get=function(callback){
	mongodb.open(function(err,db){
		if (err) {return callback(err);};
		db.collection('categorys',function(err,collection){
			if (err) { 
				mongodb.close();
				return callback(err);
			};
			collection.find().toArray(function(err,docs){
				mongodb.close();
				if (err) {
					return callback(err,null);
				};
                var arr=[];
                docs.forEach(function(doc){
                    var category=new Category(doc._id,doc.cname,doc.cimgname,doc.cdesc,0);
                     arr.push(category);
                }) ;
				callback(arr);

			});
		});
	});
}
