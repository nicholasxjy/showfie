var Feed = require('../models').Feed;


exports.create = function(content, authorid, fileid, cb) {
  var feed = new Feed();
  feed.content = content;
  feed.author = authorid;
  if (fileid) {
    feed.attachment = fileid;
  }
  feed.save(cb);
};

exports.getFeedsByQuery = function (query, fields, opts, cb) {
  Feed.find(query, fields, opts, function(err, feeds) {
    if (err) cb(err);
    var options = [
      {path: 'attachment'},
      {path: 'author'}
    ];
    Feed.populate(feeds, options, cb);
  });
};

exports.getFeedsCountByUserId = function(userid, cb) {
  Feed.count({author: userid}, cb);
};

exports.getFeedById = function(feedid, cb) {
  Feed.findById(feedid, function(err, feed) {
    if (err) cb(err);
    var options = [
      {path: 'attachment'},
      {path: 'author'},
      {path: 'comments', options: {
        sort: {'createdAt': -1}
      }},
      {path: 'likes'}
    ];
    Feed.populate(feed, options, function(err, pfeed) {
      if (err) cb(err);
      var nestOptions = [
        {path: 'comments.author', model: 'User'},
        {path: 'comments.touser', model: 'User'}
      ];
      Feed.populate(pfeed, nestOptions, cb);
    });
  });
};

exports.findFeedById = function(feedid, cb) {
  Feed.findById(feedid, cb);
}