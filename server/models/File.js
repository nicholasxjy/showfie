var mongoose = require('mongoose');
var config = require('../../config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FileSchema = new Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  mimetype: {
    type: String,
  },
  url: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
mongoose.model('File', FileSchema);