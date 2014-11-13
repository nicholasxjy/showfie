var mongoose = require('mongoose');
var config = require('../../config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'Feed'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  touser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
mongoose.model('Comment', CommentSchema);