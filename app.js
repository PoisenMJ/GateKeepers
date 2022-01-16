// initialize .env config 
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var creatorRouter = require('./routes/creator');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var gatekeeperRouter = require('./routes/gatekeeper');
var paymentRouter = require('./routes/payment');

require('./client/src/models/index');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/creator', creatorRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/gatekeeper', gatekeeperRouter);
app.use('/payment', paymentRouter);

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
});

module.exports = app;
