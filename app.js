var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose');
require('express-mongoose');
var url = require('url');


mongoose.connect('mongodb://115.28.150.31:27017/duojy');

var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');


var app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('SECRET'));
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60000 * 30}, // 30 minutes
  store: new MongoStore({
    url:'mongodb://115.28.150.31:27017/session',
  })
}));
app.use(express.static(path.join(__dirname, 'public')));


//限制非admin登录后台管理，伪静态设置。
app.use(function(req,res,next){


  //console.log(req.session);
  if (!req.session.user) {
    //admin路径单独处理
    if(req.url.indexOf("/admin/") >=0){
      res.redirect('/users/login');
    }
    else
    {
      next();
    }
  } else if (req.session.user) {
    if(req.url.indexOf("/admin/") >=0 && req.session.level !== 0){
      res.redirect('/users/login');
    }
    else
    {
      next();
    }
  }
});

app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.redirect('/404.html');
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


module.exports = app;
