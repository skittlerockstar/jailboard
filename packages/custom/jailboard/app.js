'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Jailboard = new Module('jailboard');
var RED = require('./node-red/red/red');
var sass = require('node-sass');
var fs = require('fs');
/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Jailboard.register(function(app, auth, database, http) {
var sass = require('node-sass');
sass.render({
  file: '/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/sass/jailboard.scss',
  outFile:'/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/css/jailboard.css'
}, function(err, result) { 
    console.log(err);
     fs.writeFile('/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/css/jailboard.css', result.css, function(err){
        if(!err){
          console.log('tio');
        }
      });
});

//console.log(http);
  //We enable routing. By default the Package Object is passed to the routes
  Jailboard.routes(app, auth, database);
  //console.log(RED);
  //We are adding a link to the main menu for all authenticated users
  Jailboard.menus.add({
    title: 'Node red',
    href:'/api/jailboard/red',
    roles: ['admin','authenticated'],
    menu: 'main'
  });
  Jailboard.menus.add({
    title: 'jailboard',
    link: 'jailboard',
    roles: ['authenticated'],
    menu: 'main'
  });
  app.set('views', __dirname + '/server/views');
  Jailboard.aggregateAsset('css', 'jailboard.css');

var settings = {
    httpAdminRoot:"/api/jailboard/red",
    httpNodeRoot: "/api/jailboard/red",
    nodesDir:__dirname+"/ui",
   // httpStatic:"./packages/custom/jailboard/public/editor",
    userDir:__dirname+"/node-red/user",
    functionGlobalContext: { }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(http,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Jailboard.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Jailboard.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Jailboard.settings(function(err, settings) {
        //you now have the settings object
    });
    */
RED.start();
  return Jailboard;
});