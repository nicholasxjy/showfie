var userApi = require('./server/api/user');
var feedApi = require('./server/api/feed');


var route = function(app) {
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.post('/signup', userApi.signUp);
  app.post('/login', userApi.login);
  app.post('/forgetpass', userApi.requestPasswordReset);
  app.post('/resetpass', userApi.resetPass);
  app.get('/currentuser', userApi.getCurrentUser);
  app.post('/feed/create', feedApi.create);
  app.get('/feed/all', feedApi.getAll);
}

module.exports = route;