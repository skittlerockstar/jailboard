'use strict';

var mean = require('meanio');

module.exports = function(System, app, auth, database) {

  // Home route
  var index = require('../controllers/index')(System);
  app.route('/')
    .get(index.render);
  app.route('/api/aggregatedassets')
    .get(index.aggregatedList);
  
  app.get('/*',function(req,res,next){
        res.header('workerID' , JSON.stringify(mean.options.workerid) );
        next(); // http://expressjs.com/guide.html#passing-route control
  });

  app.get('/api/get-public-config', function(req, res){
      
    var config = mean.loadConfigNew();
    
    mean.config.getSettings(req.query.name,config, function(error, doc) {
//        config = doc.settings;
    });
    return res.send(config.public);
  });
};
