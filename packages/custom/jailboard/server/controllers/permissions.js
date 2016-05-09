'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Permission = mongoose.model('Permissions'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Permissions) {

    return {
        /**
         * Find permission by id
         */
        permission: function(req, res, next, id) {
            Permission.load(id, function(err, permission) {
                if (err) return next(err);
                if (!permission) return next(new Error('Failed to load permission ' + id));
                req.permission = permission;
                next();
            });
        },
        /**
         * Create an permission
         */
        create: function(req, res) {
            
            var permission = new Permission(req.body);
            permission.user = req.user;
            
            permission.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Permissions.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/permissions/' + permission._id,
                    name: permission.title
                });

                res.json(permission);
            });
        },
        /**
         * Update an permission
         */
        update: function(req, res) {
            var permission = req.permission;

            permission = _.extend(permission, req.body);


            permission.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the permission'
                    });
                }

                Permissions.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: permission.title,
                    url: config.hostname + '/permissions/' + permission._id
                });

                res.json(permission);
            });
        },
        /**
         * Delete an permission
         */
        destroy: function(req, res) {
            var permission = req.permission;


            permission.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the permission'
                    });
                }

                Permissions.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: permission.title
                });

                res.json(permission);
            });
        },
        /**
         * Show an permission
         */
        show: function(req, res) {

            Permissions.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.permission.title,
                url: config.hostname + '/permissions/' + req.permission._id
            });

            res.json(req.permission);
        },
        /**
         * List of Permissions
         */
        all: function(req, res) {
            var query = req.acl.query('Permission');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, permissions) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the permissions'
                    });
                }

                res.json(permissions)
            });

        }
    };
}