'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Data = mongoose.model('Data'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Data) {

    return {
        /**
         * Find data by id
         */
        data: function(req, res, next, id) {
            Data.load(id, function(err, data) {
                if (err) return next(err);
                if (!data) return next(new Error('Failed to load data ' + id));
                req.data = data;
                next();
            });
        },
        /**
         * Create an data
         */
        create: function(req, res) {
            console.log("Data =");
            console.log(Data);
            var data = new Data(req.body);
            data.user = req.user;
            
            data.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Data.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/data/' + data._id,
                    name: data.title
                });

                res.json(data);
            });
        },
        /**
         * Update an data
         */
        update: function(req, res) {
            var data = req.data;

            data = _.extend(data, req.body);


            data.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the data'
                    });
                }

                Data.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: data.title,
                    url: config.hostname + '/data/' + data._id
                });

                res.json(data);
            });
        },
        /**
         * Delete an data
         */
        destroy: function(req, res) {
            var data = req.data;


            data.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the data'
                    });
                }

                Data.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: data.title
                });

                res.json(data);
            });
        },
        /**
         * Show an data
         */
        show: function(req, res) {

            Data.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.data.title,
                url: config.hostname + '/data/' + req.data._id
            });

            res.json(req.data);
        },
        /**
         * List of Data
         */
        all: function(req, res) {
            var query = req.acl.query('Data');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, data) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the data'
                    });
                }

                res.json(data)
            });

        }
    };
}