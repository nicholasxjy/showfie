var express = require('express');
var config = require('./config');
var AV = require('avoscloud-sdk').AV;
var path = require('path');
var route = require('./route');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var avosExpressCookieSession = require('avos-express-cookie-session');
var middleware = require('./server/middleware');
var app = express();

// here init avoscloud app
app.use(function(req, res, next) {
  AV.initialize(config.appID, config.appKey, config.masterKey);
  next();
});
//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//view engine setup
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').renderFile);

app.use(multer({}));
app.use(cookieParser(config.secret));
app.use(avosExpressCookieSession({
  cookie: {
    maxAge: config.cookieMaxAge
  },
  key: 'showfie'
}));
//middleware here
// app.use(middleware.authUser);


//route here
route(app);

//static
app.use(express.static(path.join(__dirname, 'client')));
//catch 404 error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(1337, function() {
  console.log('The serve is listening on port 1337!');
});

module.exports = app;