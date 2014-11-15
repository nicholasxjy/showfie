var config = require('../../config');
var userQuery = require('../proxy/user');
var feedQuery = require('../proxy/feed');
var async = require('async');

exports.getAllUserData = function(req, res, next) {
  var username = req.query.username;
  if (!username) {
    return res.json({
      status: 'fail',
      error: '信息有误'
    });
  }
  async.waterfall([
    function(cb1) {
      userQuery.getUserByName(username, false, function(err, user) {
        if (err) cb1(err);
        if (!user) {
          cb1(new Error('no this user'));
        }
        cb1(null, user);
      });
    },
    function(user, cb2) {
      var page = req.query.page || 1;
      page = parseInt(page, 10);
      var limit = config.limit;
      var skip = (page - 1) * limit;
      feedQuery.getFeedsByQuery({
        author: user._id
      }, null, {
        skip: skip,
        limit: limit,
        sort: {
          'createdAt': -1
        }
      }, function(err, feeds) {
        if (err) cb2(err);
        cb2(null, user, feeds);
      });
    }
  ], function(err, user, feeds) {
    if (err) return next(err);
    return res.json({
      status: 'success',
      user: user,
      feeds: feeds
    });
  })
}