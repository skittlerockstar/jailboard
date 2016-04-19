(function () {
  'use strict';

  /* jshint -W098 */
  // The Package is past automatically as first parameter
  module.exports = function (Jailboard, app, auth, database) {

    app.get('/api/jailboard/example/anyone', function (req, res, next) {
      res.send('Anyone can access this');
    });
    app.get('/api/jailboard/example/auth', auth.requiresLogin, function (req, res, next) {
      res.send('Only authenticated users can access this');
    });
    
    app.get('/api/jailboard/example/admin', auth.requiresAdmin, function (req, res, next) {
      res.send('Only users with Admin role can access this');
    });
    app.get('/jailboard/',function (req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/api/jailboard/example/render', function (req, res, next) {
      Jailboard.render('index', {
        package: 'jailboard'
      }, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      });
    });
    
  };
})();
