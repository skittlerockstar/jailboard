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
  var nodes = require('../controllers/nodes')(Jailboard);
  var types = require('../controllers/types')(Jailboard);

//boards routes
  app.route('/api/boards')
    .get(boards.all)
    .post(boards.create);
    
  app.route('/api/boards/:boardID')
          .get(boards.show)
          .delete(boards.destroy)
          .put(boards.update);
  
//data routes
app.route('/api/data/create')
        .post(datas.create);

  app.route('/api/data')
    .get(datas.all)
    .post(auth.requiresLogin, datas.create);
     
  app.route('/api/data/:dataID')
          .get(datas.show)
          .delete(datas.destroy)
          .put(datas.update);
//devices routes
  app.route('/api/devices')
    .get(devices.all)
    .post(auth.requiresLogin, devices.create);
 
//layouts routes
  app.route('/api/layouts')
    .get(layouts.all)
    .put(layouts.update)
            .post(layouts.create)
            .delete(layouts.destroy);
//permissions routes
  app.route('/api/permissions')
    .get(permissions.create)
    .post(auth.requiresLogin, permissions.create);
    
//nodes routes
  app.route('/api/nodes')
    .get(nodes.all)
    .post(auth.requiresLogin, nodes.create);
    
  app.route('/api/nodes/count')
     .get(nodes.count);
//types routes
  app.route('/api/types')
    .get(types.all)
    
  };
})();
