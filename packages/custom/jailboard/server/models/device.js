'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var DeviceSchema = new Schema({
  deviceID:{
    type: String,
    required: false
  },
  ownerID:{
    type: Schema.ObjectId,
    ref: 'User',
    required: false
  },
  accessToken:{
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
DeviceSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('ownerID', 'name username').exec(cb);
};

mongoose.model('Devices', DeviceSchema);
