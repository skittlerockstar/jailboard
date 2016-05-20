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
  nodeID:{
    type: Schema.ObjectId,
    ref: 'Nodes',
    required: false
  },
  data:{
      type:Array,
  default:[random()]
  },
  created:{
      type:Date,
     required: true,
 default:date()
  }
});

/**
 * Validations
 */
function date(){
      return new Date();
}
function random(){
return Math.floor((Math.random() * 50) + 1); 
}
/**
 * Statics
 */
DataSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Data', DataSchema);
