
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var partials = require('express-partials');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  //app.set(__dirname +'views/admin/*.ejs', { layout:false });
  app.use(flash());
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  //app.use(express.favicon());
  app.use(partials());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser());
  app.use(express.session({
  secret: settings.cookieSecret,
  store: new MongoStore({
  db: settings.db
  })
  }));
 
   //app.use(app.router);
  //app.use(function(err,req, res, next){
	//  console.log(typeof req.session.user );
	//if (typeof req.session.user == 'undefined'){
		//console.log('22222');
	//	res.locals.user = req.session.user;
	//	res.locals.success='success';
	//}
	//else
	//{	console.log('33333');
	//	res.locals.err='error';
	//}
  //  next();
 // });

 // app.use(routes(app));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
//app.configure('production', function(){
  //  app.use(express.errorHandler());
//});




routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
module.exports = app;