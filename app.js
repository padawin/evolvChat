var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: '!2Y5UF<\"!w|&>&jo\(keEw{}v}2HGF{H>9CeB_Xp@Y\3`M*D3S3yj*2OTvEx+O$bM^zo_{J7)D/;i`N(oCM`?jk#+tLWy:J~h6N',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/lib', express.static(__dirname + '/node_modules/Butterfly-js/dist'));

// routes
var messageRoutes = require('./routes/message')(io);
var userRoutes = require('./routes/user')(io);

app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);

// end routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

var server = http.listen(3000, function () {
	var host = server.address().address,
		port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
