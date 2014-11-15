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