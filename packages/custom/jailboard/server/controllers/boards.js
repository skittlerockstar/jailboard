'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Board = mongoose.model('Boards'),
    Users = mongoose.model('User'),
    Layouts = mongoose.model('Layouts'),
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
            Users.findOne({'name':req.body.ownerID},'_id',function(err, _id){
                req.body.ownerID = _id;
            var board = new Board(req.body);
            board.user = req.user;
            board.save(function(err) {
                    if (err) {
                        console.log(err);
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
                    board.nodeCount = 0;    
                    board.users = 1;    
                    res.json(board);
                });
             });
        },
        /**
         * Update an board
         */
        update: function(req, res) {
            var board = req.body;
           Board.findByIdAndUpdate(board._id,board,function(err,r){
              console.log(r); 
           });
            board = _.extend(board, req.body);
            

//            board.save(function(err) {
//                if (err) {
//                    return res.status(500).json({
//                        error: 'Cannot update the board'
//                    });
//                }
//
//                Boards.events.publish({
//                    action: 'updated',
//                    user: {
//                        name: req.user.name
//                    },
//                    name: board.title,
//                    url: config.hostname + '/boards/' + board._id
//                });

                res.json(board);
//            });
        },
        /**
         * Delete an board
         */
        destroy: function(req, res) {
            var board = req.params.boardID;
            Board.find({ '_id':board }).remove(function(err,respons) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the board'
                    });
                }
                res.json(board);
            });
        },
        /**
         * Show an board
         */
        show: function(req, res) {
           var board = req.params.boardID;
            Board.findOne({ '_id':board }).exec(function(err,respons) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cant Find board'
                    });
                }
                res.json({'board':respons});
            });
        },
        /**
         * List of Boards
         */
        all: function(req, res) {
            Board.find(req.query).sort('-created').populate('user', 'name username').exec(function(err, boards) {
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