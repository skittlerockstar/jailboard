'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Layout = mongoose.model('Layouts'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Layouts) {

    return {
        /**
         * Find layout by id
         */
        layout: function(req, res, next, id) {
            Layout.load(id, function(err, layout) {
                if (err) return next(err);
                if (!layout) return next(new Error('Failed to load layout ' + id));
                req.layout = layout;
                next();
            });
        },
        /**
         * Create an layout
         */
        create: function(req, res) {
            
            var layout = new Layout(req.body);
            layout.user = req.user;
            
            layout.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Layouts.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/layouts/' + layout._id,
                    name: layout.title
                });

                res.json(layout);
            });
        },
        /**
         * Update an layout
         */
        update: function(req, res) {
            var layout = req.layout;

            layout = _.extend(layout, req.body);


            layout.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the layout'
                    });
                }

                Layouts.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: layout.title,
                    url: config.hostname + '/layouts/' + layout._id
                });

                res.json(layout);
            });
        },
        /**
         * Delete an layout
         */
        destroy: function(req, res) {
            var layout = req.layout;


            layout.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the layout'
                    });
                }

                Layouts.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: layout.title
                });

                res.json(layout);
            });
        },
        /**
         * Show an layout
         */
        show: function(req, res) {

            Layouts.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.layout.title,
                url: config.hostname + '/layouts/' + req.layout._id
            });

            res.json(req.layout);
        },
        /**
         * List of Layouts
         */
        all: function(req, res) {
            var query = req.acl.query('Layout');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, layouts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the layouts'
                    });
                }

                res.json(layouts)
            });

        }
    };
}