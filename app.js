var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    mongo = require('mongodb'),
    url = 'mongodb://localhost:27017/test';





var routes = require('./routes/index');
var users = require('./routes/admin/users');
var about = require('./routes/about');
var register = require('./routes/register');
var login = require('./routes/login');
var profile = require('./routes/profile');
var logout = require('./routes/logout');
var mail = require('./routes/mail');
var user = require('./routes/user');
var chat = require('./routes/chat');

var admin = require('./routes/admin/admin');
var pages = require('./routes/admin/pages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');








// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));




app.use('*', function (req, res, next) {
  var cookie = req.cookies.logged;
  if(cookie){
    var o_id = new mongo.ObjectID(cookie);
    MongoClient.connect(url, function(err, db) {
      db.users = db.collection('users');
      db.users.find(
          {
            _id: o_id
          }
      ).toArray(function (err, user) {
        assert.equal(err, null);
        app.locals.currentUser = user[0];
        module.exports.curr = user[0];
      });
    });
    app.locals.menu = {
      'Home': '/',
      'About' : '/about',
      'Profile': '/profile',
      'Email': '/mail',
      'Chat' : '/chat',
      'Log out': '/logout'
    };
    app.locals.adminMenu = {
      'Visit Site': '/',
      'Pages' : '/admin/pages',
      'Users' : '/admin/users',
      'Log out': '/logout'
    }
  }else{
    app.locals.menu = {
      'Home': '/',
      'About' : '/about',
      'Login': '/login',
      'Register' : '/register'
    };
    app.locals.adminMenu = app.locals.currentUser = null;
  }
  var urlP = req.originalUrl.split('/');
  if(urlP.length == 2 ){
    // console.log(urlP[1]);
    MongoClient.connect(url, function(err, db) {
      db.posts = db.collection('posts');
      db.posts.find(
          {
            slug: urlP[1]
          }
      ).toArray(function(err, page) {
        assert.equal(err, null);
        // console.log(page);
        if(page.length === 1){
          res.render('page', {
            title: page[0].title,
            all: page[0]
          });
        }else{
          next();
        }
      });
    });
  }else{
    next();
  }
});

app.use('/', routes);
app.use('/user/:id', user);
app.use('/register', register);
app.use('/about', about);
app.use('/login', login);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/mail', mail);
app.use('/chat', chat);

app.use('/admin', function (req, res, next) {
  var cookie = req.cookies.logged;
  if(cookie) {
    next();
  }else{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});
app.use('/admin', admin);
app.use('/admin/pages',pages);
app.use('/admin/users', users);


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





module.exports = app;
