var crypto = require('../utility');
var config = require('../../config');
var validator = require('validator');
var userQuery = require('../proxy/user');
var feedQuery = require('../proxy/feed');
var notiQuery = require('../proxy/notification');
var async = require('async');
var qiniuService = require('../services/qiniu');
var _ = require('underscore');

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

exports.logout = function(req, res, next) {
  console.log('logout');
  req.session.destroy(function() {
    res.clearCookie(config.cookieName, {path: '/'});
    return res.json({status: 'success'});
  });
}

exports.updateInfo = function(req, res, next) {
  var sess = req.session;
  if (!sess || !sess.user) {
    return res.status(403).send({error:'login first'});
  }
  var info = req.body;
  if (info) {
    userQuery.getUserById(sess.user._id, function(err, user) {
      if (err) return next(err);
      for(var key in info) {
        console.log(key);
        user[key] = info[key]
      }
      user.save(function(err, newUser) {
        if (err) return next(err);
        return res.json({status: 'success', data: newUser});
      });
    });
  }
};

exports.updateAvatar = function(req, res, next) {
  var sess = req.session;
  if (!sess || !sess.user) {
    return res.status(403).send({
      error: 'login first'
    });
  }
  var avatarFile = req.files.file;
  if (!avatarFile) {
    return res.json({
      status: 'fail',
      error: '上传失败，请亲重新再试一次!'
    });
  }
  async.waterfall([
    function(cb1) {
      userQuery.getUserById(sess.user._id, function(err, user) {
        if (err) cb1(err);
        cb1(null, user);
      });
    },
    function(user, cb2) {
      var uptoken = qiniuService.generateUpToken(config.qiniuBucket);
      qiniuService.uploadFileLocalFile(avatarFile.path, avatarFile.originalname, uptoken, null, function(err, fileInfo) {
        if (fileInfo) {
          fileInfo.url = fileInfo.url + '?imageView2/5/w/96/h/96';
          user.avatar = fileInfo.url;
          user.save(function(err, newUser) {
            if (err) cb2(err);
            cb2(null, newUser);
          });
        } else {
          cb2(new Error('qiniu upload error'));
        }
      });
    }
  ],
  function(err, result) {
    if (err) return next(err);
    if (result) {
      return res.json({
        status: 'success',
        data: result
      });
    } else {
      return res.json({});
    }
  });
};

exports.updateBanner = function(req, res, next) {
  var sess = req.session;
  if (!sess || !sess.user) {
    return res.status(403).send({
      error: 'login first'
    });
  }
  var bannerFile = req.files.file;
  if (!bannerFile) {
    return res.json({
      status: 'fail',
      error: '上传失败，请亲重新再试一次!'
    });
  }
  async.waterfall([
    function(cb1) {
      userQuery.getUserById(sess.user._id, function(err, user) {
        if (err) cb1(err);
        cb1(null, user);
      });
    },
    function(user, cb2) {
      var uptoken = qiniuService.generateUpToken(config.qiniuBucket);
      qiniuService.uploadFileLocalFile(bannerFile.path, bannerFile.originalname, uptoken, null, function(err, fileInfo) {
        if (fileInfo) {
          fileInfo.url = fileInfo.url;
          user.banner = fileInfo.url;
          user.bannerblur = fileInfo.url + '?imageMogr2/blur/50x20';
          user.save(function(err, newUser) {
            if (err) cb2(err);
            cb2(null, newUser);
          });
        } else {
          cb2(new Error('qiniu upload error'));
        }
      });
    }
  ],
  function(err, result) {
    if (err) return next(err);
    if (result) {
      return res.json({
        status: 'success',
        data: result
      });
    } else {
      return res.json({});
    }
  });
}

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

exports.addFollow = function(req, res, next) {
  var followid = req.body.followid;
  if (!req.session || !req.session.user) {
    return res.status(403).send('login first');
  }
  // add cuser  add author
  async.parallel(
    [
      function(cb1) {
        userQuery.getUserById(req.session.user._id, function(err, user) {
          if (err) return next(err);
          user.followers.push(followid);
          user.save(function(err, newUser) {
            if (err) cb1(err);
            cb1(null, newUser);
          });
        });
      },
      function(cb2) {
        userQuery.getUserById(followid, function(err, follower) {
          if (err) cb2(err);
          follower.followings.push(req.session.user._id);
          follower.save(function(err, newFollower) {
            if (err) cb2(err);
            cb2(null, newFollower);
          });
        });
      }
    ], function(err, results) {
      if (err) return next(err);
      if (!results || results.length !== 2) {
        return res.json({status: 'fail', error: '操作有错误'});
      }
      //here create follow notification and push it to user notification
      // feed: null type: follow comment: null

      async.parallel(
        [
          function(cb1) {
            var notitype = 'follow';
            notiQuery.create(null, followid, req.session.user._id, notitype, null, function(err, noti) {
              if (err) cb1(err);
              cb1(null, noti);
            });
          },
          function(cb2) {
            userQuery.getUserById(followid, function(err, master) {
              if (err) cb2(err);
              cb2(null, master);
            })
          }
        ], function(err, results) {
          if (err) {
            throw err;
          }
          if (results && results.length === 2) {
            var noti = results[0];
            var master = results[1];
            master.notification.push(noti._id);
            master.save()
          } else {
            throw new Error('save noti fail');
          }
        });
      return res.json({status: 'success', user: results[0], follower: results[1]})
  });
};

exports.removeFollow = function(req, res, next) {
  var unfollowid = req.body.unfollowid;
  console.log(unfollowid);
  if (!req.session || !req.session.user) {
    return res.status(403).send('login first');
  }
  // add cuser  add author
  async.parallel(
    [
      function(cb1) {
        userQuery.getUserById(req.session.user._id, function(err, user) {
          if (err) return next(err);
          console.log(user);
          user.followers.pull(unfollowid);
          user.save(function(err, newUser) {
            if (err) cb1(err);
            cb1(null, newUser);
          });
        });
      },
      function(cb2) {
        userQuery.getUserById(unfollowid, function(err, follower) {
          if (err) cb2(err);
          console.log(follower);
          follower.followings.pull(req.session.user._id);
          follower.save(function(err, newFollower) {
            if (err) cb2(err);
            cb2(null, newFollower);
          });
        });
      }
    ], function(err, results) {
      if (err) return next(err);
      if (!results || results.length !== 2) {
        return res.json({status: 'fail', error: '操作有错误'});
      }
      return res.json({status: 'success', user: results[0], follower: results[1]})
  });
}

exports.getFollowers = function(req, res, next) {
  var username = req.query.username;
  var page = req.query.page;
  page = parseInt(page, 10);
  userQuery.getFollowersByName(username, function(err, user) {
    if (err) return next(err);
    return res.json({status: 'success', data: user});
  });
}
exports.getFollowings = function(req, res, next) {
  var username = req.query.username;
  var page = req.query.page;
  page = parseInt(page, 10);
  userQuery.getFollowingsByName(username, function(err, user) {
    if (err) return next(err);
    return res.json({status: 'success', data: user});
  });
}

exports.getMessages = function(req, res, next) {
  //when user check their messages, remove the unread in the meantime
  var sess = req.session;
  if (!sess || !sess.user) {
    return res.status(403).send('login first');
  }
  async.parallel(
    [
      function(cb1) {
        userQuery.getUserById(req.session.user._id, function(err, user) {
          if (err) cb1(err);
          user.notification = [];
          user.save(function(err, newUser) {
            if (err) cb1(err);
            cb1(null, newUser);
          })
        })
      },
      function(cb2) {
        notiQuery.getNotificationByUser(req.session.user._id, function(err, notis) {
          if (err) return cb2(err);
          cb2(null, notis);
        });
      }
    ], function(err, results) {
      if (err) return next(err);
      if (results && results.length === 2) {
        var allNotis = results[1];
        var likeNotis = _.filter(allNotis, function(item) {
          return item.type === 'like';
        });
        var followNotis = _.filter(allNotis, function(item) {
          return item.type === 'follow';
        });
        var commentNotis = _.filter(allNotis, function(item) {
          return item.type === 'comment';
        });
        return res.json({status: 'success', user: results[0], likes: likeNotis, follows: followNotis, comments: commentNotis});
      }
    });
}

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