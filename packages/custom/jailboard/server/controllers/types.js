'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Type = mongoose.model('Types'),
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
           var query = Type.find({});
            query.exec(function(err, types) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list types'
                    });
                }
                Type.find({}).exec(function(err,y){
                    res.json(g);
                });
            });

        }
    };
}