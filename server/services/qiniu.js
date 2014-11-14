var qiniu = require('qiniu');
var config = require('../../config');

qiniu.conf.ACCESS_KEY = config.qiniuAccesskey;
qiniu.conf.SECRET_KEY = config.qiniuSecretkey;

exports.generateUpToken = function (bucketname) {
  var policy = new qiniu.rs.PutPolicy(bucketname);
  return policy.token();
};

exports.uploadFileByStream = function(data, key, uptoken, extra, cb) {
  var myExtra = extra || new qiniu.io.PutExtra();
  qiniu.io.put(uptoken, key, data, extra, function(err, ret) {
    if (err) cb(err);
    ret.url = config.qiniuDomain + '/' + key;
    cb(null, ret);
  });
};

exports.uploadFileLocalFile = function(localFile, key, uptoken, extra, cb) {
  var myExtra = extra || new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
    if (err) cb(err);
    ret.url = config.qiniuDomain + '/' + key;
    cb(null, ret);
  });
};