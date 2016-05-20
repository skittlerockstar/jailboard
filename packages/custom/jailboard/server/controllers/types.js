'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Type = mongoose.model('Types'),
    Node = mongoose.model('Nodes'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Types) {

    return {
        /**
         * Find type by id
         */
        type: function(req, res, next, id) {
            Type.load(id, function(err, type) {
                if (err) return next(err);
                if (!type) return next(new Error('Failed to load type ' + id));
                req.type = type;
                next();
            });
        },
        /**
         * List of Types
         */
        all: function(req, res) {
             Type.find({}).exec(function(err, types) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the boards'
                    });
                }
                var count = 0;
                var newTypes =[];
                types.forEach(function(type,number){
                    Node.findOne({"nodeID":type.nodeID},function(err,result){
                        console.log(result);
                        var temp = type;
                        if(result === null){ newTypes[number] = false;}
                        else{  newTypes[number] = true;}
                        count++;
                        if(types.length === count){
                            var result = {"result":{"types":types,"available":newTypes}};
                            res.json(result);
                        }
                    });
                });
                
            });

        },
    };
}