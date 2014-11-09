var express = require('express');
var config = require('./config');
var AV = require('avoscloud-sdk').AV;
var path = require('path');
var route = require('./route');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//view engine setup
app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').renderFile);

app.use(multer({
  inMemory: true
}));

// here init avoscloud app
app.use(function(req, res, next) {
  AV.initialize(config.appID, config.appKey, config.masterKey);
  next();
});

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