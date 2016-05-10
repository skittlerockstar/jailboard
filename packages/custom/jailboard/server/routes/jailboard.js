(function () {
  'use strict';

  /* jshint -W098 */
  // The Package is past automatically as first parameter
  module.exports = function (Jailboard, app, auth, database, http,passport) {
    var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && !req.article.user._id.equals(req.user._id)) {
    return res.status(401).send('User is not authorized');
  }
  next();
};

var hasPermissions = function(req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
      var permission = req.body.permissions[i];
      if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        }
    }

    next();
};

    app.post('/api/jailboard/red/test', function (req, res, next) {
      res.send(req.body);
    });
    app.get('/api/jailboard', function (req, res, next) {
        res.redirect('jailboard/red');
    });
    app.get('/api/jailboard', function (req, res, next) {
        res.redirect('jailboard/red');
    });
//    app.get('/jailboard', function (req, res, next) {
//      Jailboard.render('index', {
//        package: 'jailboard'
//      }, function (err, html) {
//        //Rendering a view from the Package server/views
//        res.send(html);
//      });
//    });
  };
})();
