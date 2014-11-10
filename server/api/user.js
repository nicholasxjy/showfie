var AV = require('avoscloud-sdk').AV;

exports.signUp = function(req, res, next) {
  var signUpInfo = req.body;
  //here subclass user
  // var Showfier = AV.User.extend('Showfier');
  // var newShowfier = new Showfier();
  var newShowfier = new AV.User();
  newShowfier.set('username', signUpInfo.username);
  newShowfier.set('email', signUpInfo.email);
  newShowfier.set('password', signUpInfo.password);
  //this info set default when new user sign up
  newShowfier.set('location', 'other');
  newShowfier.set('gender', 'secret');
  newShowfier.set('profile', 'Not set profile yet!');
  newShowfier.signUp(null, {
    success: function(user) {
      return res.json({status: 'success', data: user});
    },
    error: function(user, error) {
      return res.json({status: 'fail', data: error});
    }
  });
};

exports.login = function(req, res, next) {
  var loginInfo = req.body;
  // var Showfier = AV.User.extend('Showfier');
  AV.User.logIn(loginInfo.username, loginInfo.password, {
    success: function(user) {
      return res.json({status: 'success', data: user});
    },
    error: function(user, error) {
      return res.json({status: 'fail', data: error});
    }
  })
};

exports.requestPasswordReset = function(req, res, next) {
  var info = req.body;
  // var Showfier = AV.User.extend('Showfier');
  AV.User.requestPasswordReset(info.email, {
    success: function() {
      return res.json({
        status: 'success',
        data: {message: '重置密码的邮件已发送到您的邮箱，请点击里面的链接以重置密码。'}
      });
    },
    error: function(error) {
      return res.json({status: 'fail', data: error});
    }
  })
};

exports.getCurrentUser = function(req, res, next) {
  // var Showfier = AV.User.extend('Showfier');
  console.log(AV.User.current());
  if (AV.User.current()) {
    var user = AV.User.current();
    return res.json({user: user});
  } else {
    return res.json({});
  }
}