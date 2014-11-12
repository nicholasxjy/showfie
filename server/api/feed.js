var config = require('../../config');
var async = require('async');
var fs = require('fs');

exports.create = function(req, res, next) {
  var info = req.body;
  var attachFile = req.files.file || null;

};

exports.getAll = function(req, res, next) {
  var page = req.query.page || 1;
  page = parseInt(page, 10);


}