'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Layout = mongoose.model('Layouts'),
    Node = mongoose.model('Nodes'),
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
         getBoardLayouts: function(req, res) {
            var boardID = req.params.boardID;
            Layouts.find({"boardID":boardID},{}).exec(function(err, data) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the data'
                    });
                }
                console.log(data);
                res.json({'datas':data});
            });

        },
        /**
         * Create an layout
         */
        create: function(req, res) {
            console.log(req.body);
            var layout = new Layout(req.body);
            layout.save(function(err) {
                console.log(err);
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                res.json(layout);
            });
        },
        /**
         * Update an layout
         */
        update: function(req, res) {
            var query = {"_id":req.body._id};
           Layout.findByIdAndUpdate(req.body._id,req.body,function(){
               res.json('bingo');
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
              var query = req.query;
              Layout.find({"boardID":query.boardID}).exec(function(err, layouts) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the boards'
                    });
                }
                console.log(layouts);
                res.json({"layouts":layouts})
            });
        }
    };
}