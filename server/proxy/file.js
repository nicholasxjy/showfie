var File = require('../models').File;

exports.create = function (info, cb) {
  var file = new File();
  file.name = info.key;
  file.type = info.type;
  file.mimetype = info.mimetype;
  file.url = info.url;
  file.save(cb)
};