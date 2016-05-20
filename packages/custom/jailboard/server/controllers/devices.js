'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Device = mongoose.model('Devices'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Devices) {

    return {
        /**
         * Find device by id
         */
        device: function(req, res, next, id) {
            Device.load(id, function(err, device) {
                if (err) return next(err);
                if (!device) return next(new Error('Failed to load device ' + id));
                req.device = device;
                next();
            });
        },
        /**
         * Create an device
         */
        create: function(req, res) {
            
            var device = new Device(req.body);
            device.user = req.user;
            
            device.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Devices.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/devices/' + device._id,
                    name: device.title
                });

                res.json(device);
            });
        },
        /**
         * Update an device
         */
        update: function(req, res) {
            var device = req.device;

            device = _.extend(device, req.body);


            device.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the device'
                    });
                }

                Devices.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: device.title,
                    url: config.hostname + '/devices/' + device._id
                });

                res.json(device);
            });
        },
        /**
         * Delete an device
         */
        destroy: function(req, res) {
            var device = req.device;


            device.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the device'
                    });
                }

                Devices.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: device.title
                });

                res.json(device);
            });
        },
        /**
         * Show an device
         */
        show: function(req, res) {

            Devices.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.device.title,
                url: config.hostname + '/devices/' + req.device._id
            });

            res.json(req.device);
        },
        /**
         * List of Devices
         */
        all: function(req, res) {
              var q = req.query.query || '{}';
               q = JSON.parse(q);
            Device.find(q).exec(function(err, devices) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the devices'
                    });
                }

                res.json({'devices':devices});
            });

        }
    };
}