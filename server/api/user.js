var crypto = require('../utility');
var config = require('../../config');
var validator = require('validator');
var userQuery = require('../proxy/user');
var feedQuery = require('../proxy/feed');

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
  userQuery.getUserByName(username, true, function(err, user) {
    console.log(user);
    if (err) return next(err);
    if (!user) return res.json({status: 'fail', error: '该用户不存在!'});
    password = crypto.md5Encryt(password);
    if (password !== user.password) {
      return res.json({status: 'fail', error: '密码错误'});
    }
    var cookieToken = crypto.encryt(user._id + '||' + user.username + '||' + user.email, config.cookie_secret);
    res.cookie(config.cookieName, cookieToken, {path: '/', maxAge: config.cookieMaxAge});
    var sess = req.session;
    sess.user = user;
    return res.json({status: 'success'});
  });
};

exports.requestPasswordReset = function(req, res, next) {
  var email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.json({
      status: 'fail',
      error: '请填写正确的邮箱地址'
    });
  }
  userQuery.findUserByEmail(email, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.json({
        status: 'fail',
        error: '没有该邮箱的用户!'
      });
    }
    //send an email to make user reset their password
    var forgetKey = crypto.randomString(15);
    user.forgetkey = forgetKey;
    user.save(function(err) {
      if (err) return next(err);
      crypto.sendResetPassMail(user.email, forgetKey, user.username);
      return res.json({
        status: 'success',
        data: '我们给你的邮箱发送一封重置密码的邮件，请点击里面的连接以重置密码。'
      });
    });
  });
};
exports.resetPass = function(req, res, next) {
  var name = req.body.name;
  var key = req.body.key;
  var password = req.body.password;
  var repassword = req.body.repassword;

  if (password !== repassword) {
    return res.json({
      status: 'fail',
      error: '两次密码不一致'
    });
  }
  userQuery.getUserByName(name, function(err, user) {
    if (err) return next(err);
    if (!user || user.forgetkey !== key) {
      return res.json({
        status: 'fail',
        error: '信息有误，无法重置密码。请重新请求重置密码!'
      });
    }
    user.password = crypto.md5Encryt(password);
    user.forgetkey = null;
    user.save(function(err) {
      if (err) return next(err);
      return res.json({
        status: 'success',
        data: '重置密码成功，请重新登录'
      });
    });
  });
};

exports.getCurrentUser = function(req, res, next) {
  var sess = req.session;
  if (sess && sess.user) {
    userQuery.getUserById(sess.user._id, function(err, user) {
      if (err) return next(err);
      feedQuery.getFeedsCountByUserId(user._id, function(err, count) {
        if (err) return next(err);
        return res.json({status:'success', data: user, userpostcount: count});
      });
    });
  } else {
    return res.json({});
  }
}