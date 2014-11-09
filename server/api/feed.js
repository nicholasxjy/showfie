var AV = require('avoscloud-sdk').AV;
var config = require('../../config');
var async = require('async');

exports.create = function(req, res, next) {
  var info = req.body;
  var attachFile = req.files.file || null;
  console.log(attachFile);
  var currentUser = AV.User.current();
  var Feed = AV.Object.extend('Feed');
  var feed = new Feed();
  feed.set('author', currentUser);
  feed.set('content', info.content);
  if (attachFile) {
    var file = new AV.File(attachFile.originalname, attachFile.buffer);
    file.save()
      .then(function() {
        if (attachFile.mimetype.indexOf('image') > -1) {
          feed.set('photo', file);
        }
        if (attachFile.mimetype.indexOf('video') > -1) {
          feed.set('video', file);
        }
        if (attachFile.mimetype.indexOf('audio') > -1) {
          feed.set('audio', file);
        }
        feed.save();
        return res.json({status: 'success'});
    }, function(error) {
        console.log(error);
        return res.json({status: 'fail'});
    })
  }
};

exports.getAll = function(req, res, next) {
  var page = req.query.page || 1;
  page = parseInt(page, 10);
  var limit = config.limit;
  var skip = (page - 1)*limit;
  var Feed = AV.Object.extend('Feed');
  var query = new AV.Query(Feed);
  query.limit(limit);
  query.skip(skip);
  query.descending('createdAt');
  query.include('author');
  query.find({
    success: function(feeds) {
      var count = feeds.length;
      async.times(count, function(n, cb) {
        var feedItem = {};
        var authorInfo = feeds[n].get('author');
        if (authorInfo) {
          feedItem.author = authorInfo.toJSON();
        }
        feedItem.feed = feeds[n].toJSON();
        cb(null, feedItem);
      }, function(err, results) {
        if (err) return res.json({status: 'fail', data: error});
        return res.json({status: 'success', data: results});
      });
    }
  })

}