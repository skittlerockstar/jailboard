'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var SensorSchema = new Schema({
  sensorID:{
    type: Schema.ObjectId,
    required: true
  },
  typeID:{
    type: Schema.ObjectId,
    ref: 'Types',
    required: true
  },
  DeviceID:{
    type: Schema.ObjectId,
    ref: 'Devices',
    required: true
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
SensorSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Sensors', SensorSchema);
