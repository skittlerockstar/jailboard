(function () {
  'use strict';

  /* jshint -W098 */
  // The Package is past automatically as first parameter
  module.exports = function (Jailboard, app, auth, database, http,passport) {
    
    app.get('/api/jailboard/example/anyone', function (req, res, next) {
      res.send('Anyone can access this');
    });

    app.post('/api/jailboard/red/test', function (req, res, next) {
      res.send(req.body);
    });
    app.get('/api/jailboard', function (req, res, next) {
     res.redirect('jailboard/red');
    });
    app.get('/jailboard', function (req, res, next) {
      Jailboard.render('index', {
        package: 'jailboard'
      }, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      });
    });
  };
})();
