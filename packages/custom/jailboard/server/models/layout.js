'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var LayoutSchema = new Schema({
  layoutID:{
    type: Schema.ObjectId,
    required: true
  },
  sensorID:{
    type: Schema.ObjectId,
    ref: 'Sensors',
    required: true
  },
  graphType:{
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
LayoutSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Layouts', LayoutSchema);
