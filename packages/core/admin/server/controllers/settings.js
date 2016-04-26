'use strict';

var mean = require('meanio');
var config = require('meanio').loadConfigNew(); 
var realconf  = require('meanio').loadConfig('original');
exports.get = function(req, res) {
    // We have called it query.name by packageName
    
    mean.config.getSettings(req.query.name,realconf, function(error, doc) {
        console.log(doc);
        if(!error){
            return res.json(doc);
        }return res.jsonp(config);
    });
};

exports.save = function(req, res) {
    var toUpdate = req.body.settings || req.body;
    console.log(toUpdate);
    mean.config.updateSettings('config',toUpdate, function(err, settings) {
        res.send(settings);
    });
};
