// initialize .env config
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');

const indexRouter = require('./routes/index');
const creatorRouter = require('./routes/creator');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const gatekeeperRouter = require('./routes/gatekeeper');
const paymentRouter = require('./routes/payment');

require('./models/index');

const app = express();

app.use(cors());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/creator', creatorRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/gatekeeper', gatekeeperRouter);
app.use('/payment', paymentRouter);

app.use(express.static(path.join(__dirname, './client/build')));
app.use(express.static(path.join(__dirname, './client/public/')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
