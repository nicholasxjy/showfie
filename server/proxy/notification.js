var Notification = require('../models').Notification;

exports.create = function(feed, master, author, type, comment, cb) {
  var noti = new Notification();
  noti.feed = feed;
  noti.master = master;
  noti.author = author;
  noti.type = type;
  noti.comment = comment;
  noti.save(cb);
}