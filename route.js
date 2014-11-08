var userApi = require('./server/api/user');

var route = function(app) {
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.post('/signup', userApi.signUp);
  app.post('/login', userApi.login);
  app.post('/forgetpass', userApi.requestPasswordReset);
}

module.exports = route;