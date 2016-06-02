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
  nodeID:{
    type: Schema.ObjectId,
    ref:"Nodes",
    required: true
  },
  boardID:{
    type: Schema.ObjectId,
    ref: 'Boards',
    required: true
  },
  deviceID:{
    type: Schema.ObjectId,
    ref: 'Devices',
    required: true
  },
  width:{
    type: Number,
    required: false,
    default:4
  },
  active:{
    type: Boolean,
    required: false,
    default:true
  },
  graphType:{
      type:String,
  default:'scatter'
  },
  title:{
      type:String,
  default:'display'
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
