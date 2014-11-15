var userApi = require('./server/api/user');
var feedApi = require('./server/api/feed');
var dataApi = require('./server/api/data');

var route = function(app) {
  app.get('/', function(req, res) {
    return res.render('index');
  });
  app.post('/signup', userApi.signUp);
  app.post('/login', userApi.login);
  app.get('/logout', userApi.logout);
  app.post('/forgetpass', userApi.requestPasswordReset);
  app.post('/resetpass', userApi.resetPass);
  app.post('/update', userApi.updateInfo);
  app.post('/update/avatar', userApi.updateAvatar);
  app.post('/update/banner', userApi.updateBanner);
  app.get('/currentuser', userApi.getCurrentUser);
  app.post('/feed/create', feedApi.create);
  app.get('/feed/all', feedApi.getAll);

  app.get('/user/data', dataApi.getAllUserData);
}

module.exports = route;