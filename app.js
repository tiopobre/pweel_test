var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//let ATLAS_URI = 'mongodb+srv://BlackHierophant7:Gf6UihGzYjDhXpAh@clusterpweel-55aug.mongodb.net/test?retryWrites=true&w=majority';
let ATLAS_URI = 'mongodb+srv://daniel:123@clustertestnode-zp8cj.mongodb.net/DanielTest?retryWrites=true&w=majority';


// start mongo DB
mongoose.connect(ATLAS_URI, {
    useNewUrlParser: true
});

// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// routers call
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;