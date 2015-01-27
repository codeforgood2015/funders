var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');

var connection_string = 'localhost/funderstogether';

var routes = require('./routes/index');
var users = require('./routes/users');
var tests = require('./routes/tests');
var organization = require('./routes/organization');
var populations = require('./routes/populations');
// var login = require('./routes/login');


var app = express();
mongoose.connect("mongodb://" + connection_string);

var db = mongoose.connection;

db.on('error', function() {
    console.log('connection error');
});

db.once('open', function(){
    console.log('Mongoose connection established');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret: 'MIT is Hogwarts', saveUninitialized: true, resave: true}));
// Authetication and sessions 
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/tests', tests);
app.use('/organization', organization);
app.use('/populations', populations);
// app.use('/login', login);

app.use(function(req,res,next){
    req.db = db;
    next();
});
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

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
           process.env.OPENSHIFT_NODEJS_IP);

module.exports = app;
