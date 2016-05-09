'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var BoardSchema = new Schema({
  boardID:{
    type: Schema.ObjectId,
    required: true
  },
  ownerID:{
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
BoardSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Boards', BoardSchema);
