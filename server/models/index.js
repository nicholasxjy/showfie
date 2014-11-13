var mongoose = require('mongoose');
var config = require('../../config');

mongoose.connect(config.dburl, function (err) {
  if (err) {
    console.log('connect db err:' + err.message);
    process.exit(1);
  }
});

require('./User');
require('./Feed');
require('./Comment');
require('./File');
exports.User = mongoose.model('User');
exports.Feed = mongoose.model('Feed');
exports.Comment = mongoose.model('Comment');
exports.File = mongoose.model('File');