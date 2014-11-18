var Notification = require('../models').Notification;

exports.create = function(feed, master, author, type, comment, cb) {
  var noti = new Notification();
  noti.feed = feed;
  noti.master = master;
  noti.author = author;
  noti.type = type;
  noti.comment = comment;
  noti.save(cb);
};

exports.getNotificationByUser = function(masterid, cb) {
  Notification.find({master: masterid}, function(err, docs) {
    if (err) cb(err);
    var options = [
      {path: 'master'},
      {path: 'author'},
      {path: 'comment'}
    ];
    Notification.populate(docs, options, cb);
  })
}