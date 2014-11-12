var crypto = require('crypto');

exports.encryt = function (str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var encstr = cipher.update(str, 'utf8', 'hex');
  encstr += cipher.final('hex');
  return encstr;
};

exports.decryt = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var destr = decipher.update(str, 'hex', 'utf8');
  destr += decipher.final('utf8');
  return destr;
}

exports.md5Encryt = function(str) {
  var md5Hash = crypto.createHash('md5');
  md5Hash.update(str);
  str = md5Hash.digest('hex');
  return str;
}