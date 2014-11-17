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

exports.getUserByName = function(name, hasPass, cb) {
  if (hasPass) {
    User.findOne({username: name}).select('password').exec(cb);
  } else {
    User.findOne({username: name}, cb);
  }

};

exports.getUserById = function(id, cb) {
  User.findById(id, cb);
};

exports.getUserByEmail =  function(email, cb) {
  User.findOne({email: email}, cb);
};

exports.getFollowersByName = function(name, cb) {
  User.findOne({username: name}, function(err, user) {
    if (err) cb(err);
    var options = [{
      path: 'followers'
    }];
    User.populate(user, options, cb);
  });
}