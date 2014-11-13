var Feed = require('../models').Feed;


exports.create = function(content, authorid, fileid, cb) {
  var feed = new Feed();
  feed.content = content;
  feed.author = authorid;
  if (fileid) {
    feed.attchment = fileid;
  }
  feed.save(cb);
};

exports.getFeedsByQuery = function (query, fields, opts, cb) {
  Feed.find(query, fields, opts, function(err, feeds) {
    if (err) cb(err);
    var options = [
      {path: 'attchment'},
      {path: 'author'}
    ];
    Feed.populate(feeds, options, cb);
  });
};