var mongoose = require('mongoose');
var config = require('../../config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  username: {
    type: String,
    index: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  gender: {
    type: String,
    default: config.gender
  },
  avatar: {
    type: String,
    default: config.avatar
  },
  banner: {
    type: String,
    default: config.banner
  },
  bannerblur: {
    type: String,
    default: config.bannerblur
  },
  location: {
    type: String,
    default: config.location
  },
  profile: {
    type: String,
    default: config.profile
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followings: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  notification: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('User', UserSchema);