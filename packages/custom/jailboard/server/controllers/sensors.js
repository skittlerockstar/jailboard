'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Sensor = mongoose.model('Sensors'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Sensors) {

    return {
        /**
         * Find sensor by id
         */
        sensor: function(req, res, next, id) {
            Sensor.load(id, function(err, sensor) {
                if (err) return next(err);
                if (!sensor) return next(new Error('Failed to load sensor ' + id));
                req.sensor = sensor;
                next();
            });
        },
        /**
         * Create an sensor
         */
        create: function(req, res) {
            
            var sensor = new Sensor(req.body);
            sensor.user = req.user;
            
            sensor.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Sensors.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/sensors/' + sensor._id,
                    name: sensor.title
                });

                res.json(sensor);
            });
        },
        /**
         * Update an sensor
         */
        update: function(req, res) {
            var sensor = req.sensor;

            sensor = _.extend(sensor, req.body);


            sensor.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the sensor'
                    });
                }

                Sensors.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: sensor.title,
                    url: config.hostname + '/sensors/' + sensor._id
                });

                res.json(sensor);
            });
        },
        /**
         * Delete an sensor
         */
        destroy: function(req, res) {
            var sensor = req.sensor;


            sensor.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the sensor'
                    });
                }

                Sensors.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: sensor.title
                });

                res.json(sensor);
            });
        },
        /**
         * Show an sensor
         */
        show: function(req, res) {

            Sensors.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.sensor.title,
                url: config.hostname + '/sensors/' + req.sensor._id
            });

            res.json(req.sensor);
        },
        /**
         * List of Sensors
         */
        all: function(req, res) {
            var query = req.acl.query('Sensor');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, sensors) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the sensors'
                    });
                }

                res.json(sensors)
            });

        }
    };
}