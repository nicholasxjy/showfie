var route = function(app) {
  app.get('/', function(req, res) {
    return res.render('index');
  });
}

module.exports = route;