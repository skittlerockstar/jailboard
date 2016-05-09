'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Board Schema
 */
var PermissionSchema = new Schema({
  userID:{
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  boardID:{
    type: Schema.ObjectId,
    ref: 'Boards',
    required: true
  },
  permissions:{
      type:Array,
  default:'null'
  }
});

/**
 * Validations
 */

/**
 * Statics
 */
PermissionSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Permissions', PermissionSchema);
