var Feed = require('../models').Feed;

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