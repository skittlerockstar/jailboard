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
  },
  ownerID:{
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },  
  name:{
    type: String,
    required: true
  },  
  companyName:{
    type: String,
    required: true
  },
  suspended:{
    type: Boolean,
    default:false
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
  }).populate('user', '_id').exec(cb);
};

mongoose.model('Boards', BoardSchema);
