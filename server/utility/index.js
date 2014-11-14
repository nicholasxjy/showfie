var crypto = require('crypto');
var nodemailer = require('nodemailer');
var util = require('util');
var config = require('../../config');

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
};

exports.md5Encryt = function(str) {
  var md5Hash = crypto.createHash('md5');
  md5Hash.update(str);
  str = md5Hash.digest('hex');
  return str;
};

exports.randomString = function(size) {
  var lenSize = size || 6;
  var allStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var maxLen = allStr.length + 1;
  var random = '';
  while(lenSize > 0) {
    random += allStr.charAt(Math.floor(Math.random()*maxLen));
    lenSize--;
  }
  return random;
};

exports.sendResetPassMail = function(email, key, name) {
  var smtpTransport = nodemailer.createTransport('SMTP', config.mailConfig);
  var from = util.format('%s <%s>', config.sitename, config.mailConfig.auth.user);
  var to = email;
  var subject = config.sitename + ' 重置密码';
  var content = "<p>您好，</p>" + "<p>请在24小时内点击下面的链接，来重置您的密码。</p>" +
        "<a href='" + config.host +"/resetpass?key="+ key +"&name="+ name +"'>重置密码链接</a>";
  smtpTransport.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: content
  }, function(err, res) {
    if (err) {
      console.log('Send reset pass email error:' + err.message);
    }
  })
};