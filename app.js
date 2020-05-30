var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const fileUpload = require("express-fileupload");
var edge = require("edge.js");
var mongoose = require('mongoose')
var bodyParser = require("body-parser");
var connectMongo = require("connect-mongo");
var expressSession = require("express-session");
var { config, engine } = require('express-edge');
const flash = require('express-flash');

const indexRouter = require('./routes/index');
const businessRouter = require("./routes/business");

var app = express();

const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

//connect to mongodb
mongoose
  .connect("mongodb://localhost/DPO", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'edge');

app.use("*", (req, res, next) => {
  edge.global("admin", req.session.role == 0);
  edge.global("distributor", req.session.role == 1);
  edge.global("retailer", req.session.role == 2);
  next();
});

app.use(fileUpload());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(engine);
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', indexRouter);
app.get('/business', businessRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
