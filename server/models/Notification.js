var mongoose = require('mongoose');
var config = require('../../config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var NotificationSchema = new Schema({
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed'
  },
  master: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String //follow comment like
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
mongoose.model('Notification', NotificationSchema);