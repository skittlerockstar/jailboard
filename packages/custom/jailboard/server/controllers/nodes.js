'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Node = mongoose.model('Nodes'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Nodes) {

    return {
        /**
         * Find node by id
         */
        node: function(req, res, next, id) {
            Node.load(id, function(err, node) {
                if (err) return next(err);
                if (!node) return next(new Error('Failed to load node ' + id));
                req.node = node;
                next();
            });
        },
        count: function(req, res) {
            Node.count({'boardID':req.query.boardID},function(err,result){
                 res.json({'nodeCount':result});
            });
         
        },
        /**
         * Create an node
         */
        create: function(req, res) {
            
            var node = new Node(req.body);
            node.user = req.user;
            
            node.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Nodes.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/nodes/' + node._id,
                    name: node.title
                });

                res.json(node);
            });
        },
        /**
         * Update an node
         */
        update: function(req, res) {
            var node = req.node;

            node = _.extend(node, req.body);


            node.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the node'
                    });
                }

                Nodes.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: node.title,
                    url: config.hostname + '/nodes/' + node._id
                });

                res.json(node);
            });
        },
        /**
         * Delete an node
         */
        destroy: function(req, res) {
            var node = req.node;


            node.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the node'
                    });
                }

                Nodes.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: node.title
                });

                res.json(node);
            });
        },
        /**
         * Show an node
         */
        show: function(req, res) {

            Nodes.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.node.title,
                url: config.hostname + '/nodes/' + req.node._id
            });

            res.json(req.node);
        },
        /**
         * List of Nodes
         */
        all: function(req, res) {
          var query = req.query.query || {};
            if(typeof query === 'string'){
                query = JSON.parse(query);
            }
              Node.find(query).exec(function(err, nodes) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the boards'
                    });
                }
                console.log(nodes);
                res.json({"nodes":nodes});
            });

        }
    };
}