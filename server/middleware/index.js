var config = require('../../config');
var crypto = require('../utility');
var userQuery = require('../proxy/user');

exports.authUser = function (req, res, next) {
  var sess = req.session;
  if (sess && sess.user) {
    return next();
  } else {
    var authCookie = req.cookies[config.cookieName];
    if (!authCookie) {
      return next();
    }
    var cookieToken = crypto.decryt(authCookie, config.cookie_secret);
    var userid = cookieToken.split('||')[0];
    userQuery.getUserById(userid, function(err, user) {
      if (err) next(err);
      if (user) {
        sess.user = user;
        return next();
      } else {
        return next();
      }
    });
  }
};