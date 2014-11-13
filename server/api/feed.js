var config = require('../../config');
var async = require('async');
var fs = require('fs');
var feedQuery = require('../proxy/feed');

exports.create = function(req, res, next) {
  var info = req.body;
  var attachFile = req.files.file || null;

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