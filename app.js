var express = require('express');
var config = require('./config');
var path = require('path');
var route = require('./route');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var middleware = require('./server/middleware');
var app = express();


//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine setup
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').renderFile);

app.use(multer({}));
app.use(cookieParser(config.cookie_secret));
app.use(session({
  name: 'showfie.sid',
  secret: config.session_secret,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    db: config.dbname
  })
}));
//middleware here
app.use(middleware.authUser);


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