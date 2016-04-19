'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Jailboard = new Module('jailboard');
var RED = require('./node-red/red/red');
var sass = require('node-sass');
var fs = require('fs');
var autoprefixer = require('autoprefixer');
var passport =  require('passport');
var mongoose = require('mongoose');
/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Jailboard.register(function(app, auth, database, http) {
    
//var sass = require('node-sass');
//sass.render({
//  file: '/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/sass/jailboard.scss',
//  outFile:'/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/css/jailboard.css'
//}, function(err, result) { 
//    console.log(err);
//     fs.writeFile('/home/max/Public/workdir/jailboard/packages/custom/jailboard/public/assets/css/jailboard.css', result.css, function(err){
//        if(!err){
//          console.log('Once upon a time there were no errors( jailboard app )');
//        }else{
//        }
//      });
//});
//app.use(passport.initialize());
//app.use(passport.session());
//console.log(http);
  //We enable routing. By default the Package Object is passed to the routes
  Jailboard.routes(app, auth, database, http);
  //console.log(RED);
  //We are adding a link to the main menu for all authenticated users
  Jailboard.menus.add({
    title: 'NODERED',
    href:'api/jailboard/red',
    roles: ['admin','developer'],
    menu: 'main',
  });
  Jailboard.menus.add({
    title: 'Jailboard',
    link: 'Jailboard',
    roles: ['admin','developer'],
    menu: 'main'
  });
//    Jailboard.menus.add({
//    title: 'jailboard example page',
//    link: 'jailboard example page',
//    roles: ['admin','authenticated'],
//    menu: 'main'
//  });
  Jailboard.aggregateAsset('css', 'jailboard.css');
  Jailboard.aggregateAsset('js','plotlyscript.js');

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
app.set('views', __dirname + '/server/views');
  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Jailboard.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this tme with no callback
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
