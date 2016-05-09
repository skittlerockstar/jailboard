'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Board = mongoose.model('Boards'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Boards) {

    return {
        /**
         * Find board by id
         */
        board: function(req, res, next, id) {
            Board.load(id, function(err, board) {
                if (err) return next(err);
                if (!board) return next(new Error('Failed to load board ' + id));
                req.board = board;
                next();
            });
        },
        /**
         * Create an board
         */
        create: function(req, res) {
            console.log('board = ');
            console.log(Board);
            var board = new Board(req.body);
            board.user = req.user;
            
            board.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }

                Boards.events.publish({
                    action: 'created',
                    user: {
                        name: 'derp'
                    },
                    url: config.hostname + '/boards/' + board._id,
                    name: board.title
                });

                res.json(board);
            });
        },
        /**
         * Update an board
         */
        update: function(req, res) {
            var board = req.board;

            board = _.extend(board, req.body);


            board.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the board'
                    });
                }

                Boards.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: board.title,
                    url: config.hostname + '/boards/' + board._id
                });

                res.json(board);
            });
        },
        /**
         * Delete an board
         */
        destroy: function(req, res) {
            var board = req.board;


            board.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the board'
                    });
                }

                Boards.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: board.title
                });

                res.json(board);
            });
        },
        /**
         * Show an board
         */
        show: function(req, res) {

            Boards.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.board.title,
                url: config.hostname + '/boards/' + req.board._id
            });

            res.json(req.board);
        },
        /**
         * List of Boards
         */
        all: function(req, res) {
            var query = req.acl.query('Board');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, boards) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the boards'
                    });
                }

                res.json(boards)
            });

        }
    };
}