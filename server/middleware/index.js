var AV = require('avoscloud-sdk').AV;
var config = require('../../config');
var crypto = require('../utility');

exports.authUser = function (req, res, next) {
  var sess = req.session;
  if (sess && sess.user) {
    return next();
  } else {
    var authCookie = req.cookies[config.cookieName];
    console.log(authCookie);
    if (!authCookie) {
      return next();
    }
    var cookieToken = crypto.decryt(authCookie, config.session_secret);
    console.log(cookieToken);
    var userid = cookieToken;
    console.log(userid);
    var query = new AV.Query(AV.User);
    query.equalTo('objectId', userid);
    query.find({
      success: function(users) {
        if (users && users.length > 0) {
          sess.user = users[0];
          return next();
        } else {
          return next();
        }
        console.log('*******', sess.user);
      }
    });
  }
};