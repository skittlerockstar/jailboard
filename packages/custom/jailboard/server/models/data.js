'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var DataSchema = new Schema({
  sensorID:{
    type: Schema.ObjectId,
    ref: 'Sensors',
    required: true
  },
  data:{
      type:Array,
  default:'null'
  },
  created:{
      type:Date,
  required: true
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
DataSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Data', DataSchema);
