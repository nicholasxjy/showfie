var AV = require('avoscloud-sdk').AV;
var config = require('../../config');
var async = require('async');
var fs = require('fs');

exports.create = function(req, res, next) {
  var info = req.body;
  var attachFile = req.files.file || null;
  var currentUser = AV.User.current();
  if (currentUser) {
    var Feed = AV.Object.extend('Feed');
    var feed = new Feed();
    feed.set('author', currentUser);
    feed.set('content', info.content);
    if (attachFile) {
      fs.readFile(attachFile.path, function(err, data) {
        if (err) next(err);
        var base64Data = data.toString('base64');
        var file = new AV.File(attachFile.originalname, {base64: base64Data});
        file.save()
          .then(function(newFile) {
            if (attachFile.mimetype.indexOf('image') > -1) {
              feed.set('photo', newFile);
            }
            if (attachFile.mimetype.indexOf('video') > -1) {
              feed.set('video', newFile);
            }
            if (attachFile.mimetype.indexOf('audio') > -1) {
              feed.set('audio', newFile);
            }
            feed.save();
            return res.json({status: 'success'});
        }, function(error) {
            console.log(error);
            return res.json({status: 'fail'});
        })
      });
    } else {
      feed.save(null, {
        success: function(newfeed) {
          return res.json({status: 'scuccess'});
        },
        error: function(newfeed, error) {
          return res.json({status: 'fail'});
        }
      });
    }
  } else {
    return res.json({status: 'fail'});
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