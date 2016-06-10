'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Datas = mongoose.model('Data'),
    Devices = mongoose.model('Devices'),
    Nodes = mongoose.model('Nodes'),
    Types = mongoose.model('Types'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(DataSources) {

    return {
        /**
         * Find data by id
         */
        data: function(req, res, next, id) {
            Datas.load(id, function(err, data) {
                if (err) return next(err);
                if (!data) return next(new Error('Failed to load data ' + id));
                req.data = data;
                next();
            });
        },
        /**
         * Create an data
         */
        create: function(req, res) {
            var incoming = req.body;
            var rand = Math.round(Math.random()*50)+1;
            var date = new Date();
//            incoming.data = [rand];
           //check if device exists
           Devices.findOne({"deviceID":incoming.deviceID},"_id",function(err,result){
             // if result check if sensor exists / else create new device and sensor.
              Types.findOne({"nodeID":incoming.nodeID},function(r,type){
                  incoming.typeID = type._id;
                    if(result === null){
                        createDevice(incoming);
                    }else{
                        console.log(result);
                        Nodes.findOne({"deviceID":result._id,"nodeID":incoming.nodeID},function(r,noderes){
                            console.log('does it exists');
                            console.log(noderes);
                            if(noderes === null){
                                 createNode(incoming,result);
                            }else{
                                createData(incoming,result,noderes);
                            }
                        });
                    }
             });
           });
           
           function createDevice(incoming){
               var device = new Devices({"deviceID":incoming.deviceID,"accessToken":"randomshit"});
                 device.save(function(err,devres){
                     console.log(err);
                     console.log('Device created');
                          createNode(incoming,devres);
                 });
           }
           function createNode(incoming,devres){
                var node = new Nodes({"typeID":incoming.typeID,"nodeID":incoming.nodeID,"deviceID":devres._id,"boardID":"5731b663c11caa9818fed312"});
                 node.save(function(err,noderes){
                     console.log(err);
                      console.log('Node created');
                     createData(incoming,devres,noderes);
                  });
           }
           function createData(incoming,devres,noderes){
               var data = new Datas({"data":incoming.data,"nodeID":noderes._id,"created":date});
                data.save(function(err,c){
                    console.log(err);
                    console.log(c);
               });
           }
           res.json('BINGO');

        },
        /**
         * Update an data
         */
        update: function(req, res) {
            var data = req.data;

            data = _.extend(data, req.body);


            data.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the data'
                    });
                }

                Datas.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: data.title,
                    url: config.hostname + '/data/' + data._id
                });

                res.json(data);
            });
        },
        /**
         * Delete an data
         */
        destroy: function(req, res) {
            var data = req.data;


            data.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the data'
                    });
                }

                Datas.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: data.title
                });

                res.json(data);
            });
        },
        /**
         * Show an data
         */
        show: function(req, res) {

             var data = req.params.dataID;
            Datas.findOne({ '_id':data }).exec(function(err,respons) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cant Find board'
                    });
                }
                res.json({'data':respons});
            });
        },
        /**
         * List of Datas
         */
        all: function(req, res) {
            console.log(req.query);
            var limit = req.query.limit || null;
            var sort = req.query.sort || -1;
            var nodeID = req.query.nodeID || null;
            limit = parseInt(limit);
            Datas.find({"nodeID":nodeID}).sort({'created':-1}).limit(limit).exec(function(err, data) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the data'
                    });
                }
                console.log('');
                console.log(data);
                console.log('');
                res.json({'datas':data});
            });

        }
    };
}