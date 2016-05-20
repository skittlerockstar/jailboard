'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var TypeSchema = new Schema({
  nodeID:{
    type: String,
    ref: 'Nodes',
    required: true
  },
  type:{
  type:String,
  default:'null'
  },
  glyph:{
  type:String,
  default:'null'
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
TypeSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Types', TypeSchema);
