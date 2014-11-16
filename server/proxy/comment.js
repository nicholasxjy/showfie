var Comment = require('../models').Comment;

exports.create = function (feed, author, touser, content, cb) {
  var comment = new Comment();
  comment.feed = feed;
  comment.author = author;
  comment.touser = touser;
  comment.content = content;
  comment.save(cb);
}