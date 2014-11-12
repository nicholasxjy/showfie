var User = require('../models').User;

exports.create = function(username, email, password, cb) {
  var user = new User();
  user.username = username;
  user.email = email;
  user.password = password;
  user.save(cb);
};

exports.getUsersByQuery = function(query,fields, opts, cb) {
  User.find(query, fields, opts, cb);
};

exports.getUserByName = function(name, cb) {
  User.findOne({username: name}, cb);
};

exports.getUserById = function(id, cb) {
  User.findById(id, cb);
}