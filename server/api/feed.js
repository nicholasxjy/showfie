var config = require('../../config');
var async = require('async');
var fs = require('fs');
var feedQuery = require('../proxy/feed');
var fileQuery = require('../proxy/file');
var commentQuery = require('../proxy/comment');
var qiniuService = require('../services/qiniu');
var Feed = require('../models').Feed;
var _ = require('underscore');


exports.create = function(req, res, next) {
  var user = req.session.user;
  var content = req.body.content || '';
  var attachFile = req.files.file || null;
  if (!user) {
    return res.json({status: 'fail', error: 'login first!'});
  }
  if (attachFile) {
    async.waterfall([
        function(cb1) {
          //upload file
          //there use qiniu sdk
          var uptoken = qiniuService.generateUpToken(config.qiniuBucket);
          qiniuService.uploadFileLocalFile(attachFile.path, attachFile.originalname, uptoken, null, function(err, fileInfo) {
            if (fileInfo) {
              fileInfo.mimetype = attachFile.mimetype;
              if (attachFile.mimetype.indexOf('image') > -1) {
                fileInfo.type = 'image';
              }
              if (attachFile.mimetype.indexOf('audio') > -1) {
                fileInfo.type = 'audio';
              }
              if (attachFile.mimetype.indexOf('video') > -1) {
                fileInfo.type = 'video';
              }
              fileQuery.create(fileInfo, function(err, file) {
                if (err) cb1(err);
                cb1(null, file);
              });
            } else {
              cb1(new Error('qiniu upload error'));
            }
          });
        },
        function(file, cb2) {
          if (file) {
            feedQuery.create(content, user._id, file._id, function(err, newFeed) {
              if (err) cb2(err);
              cb2(null, newFeed);
            });
          } else {
            cb2(new Error('file not upload'));
          }
        }
      ], function(err, result) {
        if (err) return next(err);
        return res.json({status: 'success'});
    });
  } else {
    feedQuery.create(content, user._id, null, function(err, newFeed) {
      if (err) return next(err);
      return res.json({status: 'success'});
    });
  }
};

exports.getAll = function(req, res, next) {
  var page = req.query.page || 1;
  page = parseInt(page, 10);
  var limit = config.limit;
  var skip = (page - 1) * limit;
  feedQuery.getFeedsByQuery(null, null, {
    skip: skip,
    limit: limit,
    sort: {
      'createdAt': -1
    }
  }, function(err, feeds) {
    if (err) return next(err);
    return res.json({status: 'success', data: feeds});
  });
};

exports.getFeedDetail = function(req, res, next) {
  var feedid = req.query.id;
  if (!feedid) {
    return res.json({status: 'fail', error: '信息有误!'});
  }
  feedQuery.getFeedById(feedid, function(err, feed) {
    if (err) return next(err);
    if (!feed) {
      return res.json({status: 'fail', error: '未找到此feed'});
    }
    var likes = _.pluck(feed.likes, '_id');
    return res.json({status: 'success', feed: feed, likeusers: likes});
  });
};

exports.addLike = function(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(403).send('login first');
  }
  var feedid = req.body.feedid;
  feedQuery.findFeedById(feedid, function(err, feed) {
    if (err) return next(err);
    feed.likes.push(req.session.user._id);
    feed.save(function(err, newFeed) {
      if (err) return next(err);
      return res.json({status: 'success', data: newFeed.likes});
    });
  });
};

exports.removeLike = function(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(403).send('login first');
  }
  var feedid = req.body.feedid;
  feedQuery.findFeedById(feedid, function(err, feed) {
    if (err) return next(err);
    feed.likes.pull(req.session.user._id);
    feed.save(function(err, newFeed) {
      if (err) return next(err);
      return res.json({status: 'success', data: newFeed.likes});
    });
  });
};

exports.addComment = function(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(403).send('login first');
  }
  var feed = req.body.feedid;
  var author = req.session.user._id;
  var touser = req.body.touserid;
  var content = req.body.content;
  async.waterfall(
    [
      function(cb1) {
        commentQuery.create(feed, author, touser, content, function(err, comment) {
          if (err) cb1(err);
          cb1(null, comment);
        });
      },
      function(comment, cb2) {
        feedQuery.getFeedById(feed, function(err, thefeed) {
          thefeed.comments.push(comment._id);
          thefeed.save(function(err, newFeed) {
            if (err) cb2(err);
            cb2(null, newFeed);
          })
        })
      }
    ], function(err, result) {
      if (err) return next(err);
      var options = [
        {path: 'comments'}
      ];
      Feed.populate(result, options, function(err, commentFeed) {
        var nestOptions = [
          {path: 'comments.author', model: 'User'},
          {path: 'comments.touser', model: 'User'}
        ];
        Feed.populate(commentFeed, nestOptions, function(err, finalFeed) {
          if (err) return next(err);
          return res.json({status: 'success', data: finalFeed});
        });
      });
    });
};
