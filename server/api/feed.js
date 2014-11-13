var config = require('../../config');
var async = require('async');
var fs = require('fs');
var feedQuery = require('../proxy/feed');
var fileQuery = require('../proxy/file');
var qn = require('qn');

exports.create = function(req, res, next) {
  var user = req.session.user;
  var content = req.body.content || '';
  var attachFile = req.files.file || null;
  if (!user) {
    return res.json({status: 'fail', error: 'login first!'});
  }
  if (attachFile) {
    console.log(attachFile);
    async.waterfall([
        function(cb1) {
          //upload file
          var client = qn.create({
            accessKey: config.qiniuAccesskey,
            secretkey: config.qiniuSecretkey,
            bucket: config.qiniuBucket,
            domain: config.qiniuDomain
          });
          client.uploadFile(attachFile.path, {key: attachFile.originalname}, function(err, fileInfo) {
            if (fileInfo) {
              console.log(fileInfo);
              fileInfo.mimetype = attachFile.mimetype;
              if (attachFile.mimetype.indexOf('image') > 0) {
                fileInfo.type = 'image';
              }
              if (attachFile.mimetype.indexOf('audio') > 0) {
                fileInfo.type = 'audio';
              }
              if (attachFile.mimetype.indexOf('video') > 0) {
                fileInfo.type = 'video';
              }
              fileQuery.create(fileInfo, function(err, file) {
                if (err) cb1(err);
                cb1(null, file);
              });
            } else {
              cb1(new Error('qiniu upload error'));
            }
          })
        },
        function(file, cb2) {
          if (file) {
            feedQuery.create(content, user._id, file._id, function(err, newFeed) {
              if (err) cb2(err);
              cb2(null, newFeed);
            });
          } else {
            cb2(new Error('file not upload'));
          }
        }
      ], function(err, result) {
        if (err) return next(err);
        return res.json({status: 'success'});
    });
  } else {
    feedQuery.create(content, user._id, null, function(err, newFeed) {
      if (err) return next(err);
      return res.json({status: 'success'});
    });
  }
};

exports.getAll = function(req, res, next) {
  var page = req.query.page || 1;
  page = parseInt(page, 10);
  var limit = config.limit;
  var skip = (page - 1) * limit;
  feedQuery.getFeedsByQuery(null, null, {
    skip: skip,
    limit: limit,
    sort: {
      'createdAt': -1
    }
  }, function(err, feeds) {
    if (err) return next(err);
    return res.json({status: 'success', data: feeds});
  });


}