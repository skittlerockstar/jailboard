'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var NodeSchema = new Schema({
  nodeID:{
    type: Schema.ObjectId,
    required: true
  },
  typeID:{
    type: Schema.ObjectId,
    ref: 'Types',
    required: true
  },
  deviceID:{
    type: Schema.ObjectId,
    ref: 'Devices',
    required: true
  },
  boardID:{
    type: Schema.ObjectId,
    ref: 'Boards',
    required: true
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
NodeSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Nodes', NodeSchema);
