var crypto = require('../utility');
var config = require('../../config');
var validator = require('validator');
var userQuery = require('../proxy/user');

exports.signUp = function(req, res, next) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  if (username === '' || email === '' || password === '') {
    return res.json({
      status: 'fail',
      error: '信息不完整'
    });
  }
  if (!validator.isAlphanumeric(username)) {
    return res.json({
      status: 'fail',
      error: '用户名只允许字母和数字'
    });
  }
  if (!validator.isEmail(email)) {
    return res.json({
      status: 'fail',
      error: '请填写正确的邮箱地址'
    });
  }

  if (!validator.isAlphanumeric(password)) {
    return res.json({
      status: 'fail',
      error: '密码只允许字母和数字'
    });
  }
  userQuery.getUsersByQuery({
    '$or': [{
      'username': username
    }, {
      'email': email
    }]
  }, null, null, function(err, users) {
    if (err) return next(err);
    if (users && users.length > 0) {
      return res.json({
        status: 'fail',
        error: '用户名或邮箱已被使用'
      });
    }
    //encryt password
    password = crypto.md5Encryt(password);
    userQuery.create(username, email, password, function(err, newUser) {
      if (err) return next(err);
      //发送邮件 注册成功


      return res.json({
        status: 'success'
      });
    })
  })
};

exports.login = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (username === '' || password === '') {
    return res.json({
      status: 'fail',
      error: '请填写用户名和密码'
    });
  }
  userQuery.getUserByName(username, function(err, user) {
    if (err) return next(err);
    if (!user) return res.json({status: 'fail', error: '该用户不存在!'});
    password = crypto.md5Encryt(password);
    if (password !== user.password) {
      return res.json({status: 'fail', error: '密码错误'});
    }
    var cookieToken = crypto.encryt(user._id + '||' + user.username + '||' + user.email, config.cookie_secret);
    res.cookie(config.cookieName, cookieToken, {path: '/', maxAge: config.cookieMaxAge});
    return res.json({status: 'success'});
  });
};

exports.requestPasswordReset = function(req, res, next) {
  var info = req.body;

};

exports.getCurrentUser = function(req, res, next) {
  var sess = req.session;
  if (sess && sess.user) {
    return res.json({status:'success', data: sess.user});
  } else {
    return res.json({});
  }

}