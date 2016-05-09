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

  var boards = require('../controllers/boards')(Jailboard);
  var datas = require('../controllers/data')(Jailboard);
  var devices = require('../controllers/devices')(Jailboard);
  var layouts = require('../controllers/layouts')(Jailboard);
  var permissions = require('../controllers/permissions')(Jailboard);
  var sensors = require('../controllers/sensors')(Jailboard);
  var types = require('../controllers/types')(Jailboard);

//boards routes
  app.route('/api/boards')
    .get(boards.create)
    .post(auth.requiresLogin, boards.create);
    
//data routes
  app.route('/api/datas')
    .get(datas.create)
    .post(auth.requiresLogin, datas.create);
    
//devices routes
  app.route('/api/devices')
    .get(devices.create)
    .post(auth.requiresLogin, devices.create);
    
//layouts routes
  app.route('/api/layouts')
    .get(layouts.create)
    .post(auth.requiresLogin, layouts.create);
    
//permissions routes
  app.route('/api/permissions')
    .get(permissions.create)
    .post(auth.requiresLogin, permissions.create);
    
//sensors routes
  app.route('/api/sensors')
    .get(sensors.create)
    .post(auth.requiresLogin, sensors.create);
    
//types routes
  app.route('/api/types')
    .get(types.create)
    .post(auth.requiresLogin, types.create);
    
  };
})();
