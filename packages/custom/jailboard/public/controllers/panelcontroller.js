(function () {
    'use strict';

    /* jshint -W098 */
    angular
            .module('mean.jailboard')
            .controller('CtrlPanelController', CtrlPanelController)
            .controller('LayoutController', LayoutController)
            ;

    CtrlPanelController.$inject = ['$interval', 'Nodes', 'Devices', 'Layouts', 'Types', 'Datas', 'Boards', '$stateParams', '$scope', '$timeout', 'Global', 'Jailboard', '$http'];

    function CtrlPanelController($interval, Nodes, Devices, Layouts, Types, Datas, Boards, $stateParams, $scope, $timeout, Global, Jailboard, $http) {
        console.log('loaded');
        $scope.global = Global;
        $scope.authorized = false;
        checkUserStatus($http, Jailboard, $scope);
        $scope.rotate = false;
        $scope.collapsed = false;
        $scope.addDataSource = false;
        $scope.board = '';
        $scope.boardID = $stateParams.boardID;
        $scope.Data = Datas;
        $scope.interval = $interval;
        $scope.selectedDevice = "";
        $scope.availableNodes = {};
        $scope.types = {};
       
        $scope.getter = function (prop) {
            return $scope[prop];
        };
        $scope.setter = function (prop, val) {
            $scope[prop] = val;
        };
        $scope.animDelay = function () {
            if (this.collapsed != this.rotate) {
                if (this.rotate == null) {
                    this.rotate = this.collapsed;
                } else {
                    this.rotate = null;
                    $timeout(function () {
                        $scope.rotate = $scope.collapsed;
                    }, 100);
                }
            }
        };

        $scope.getLayouts = function () {
            Layouts.get({"boardID": $scope.boardID}, function (b) {
                console.log(b);
                $scope.layouts = b.layouts;
            });
        }

        $scope.getDevices = function () {
            Devices.get({}, function (b) {
                $scope.devices = b.devices;
            });
        }

        $scope.getTypes = function () {
            Types.get({}, function (b) {
                b = b.result;
                $scope.types = b.types;
                b.types.forEach(function (t, n) {
                    $scope.types[n].available = b.available[n];
                });
                $scope.getLayouts();
            });
        }
        $scope.replaceNodeTypes = function (node) {
            var test = $scope.types.filter(function (type) {
                return type.nodeID == node.nodeID
            });
            node.nodeType = test[0].nodeType;
            return node;
        }

        $scope.getBoard = function () {
            Boards.get({
                boardID: $stateParams.boardID
            }, function (b) {
                $scope.board = b.board;
            });
        }
        $scope.getAvailableDevices = function (d, callback) {
            console.log(d);
            Nodes.get({"query": {"nodeID": d}}, function (nodes) {
                var deviceList = [];
                var loopedIDs = [];
                var run = 0;
                nodes.nodes.forEach(function (node, number) {
                    Devices.get({"query": {"_id": node.deviceID}}, function (res) {
                        if (res.devices.length !== 0) {
                            if (loopedIDs.indexOf(res.devices[0].deviceID) === -1) {
                                loopedIDs.push(res.devices[0].deviceID);
                                Nodes.get({"query": {"deviceID": res.devices[0]._id}}, function (devNodes) {
                                    deviceList.push(res.devices[0]);
                                    deviceList[deviceList.length - 1].nodes = devNodes.nodes;
                                    run++;
                                    if (run === number + 1) {
                                        callback(deviceList);
                                    }
                                });
                            }
                        } else {
                            run++;
                            if (run === number + 1) {
                                callback(deviceList);
                            }
                        }
                    });

                });

            });
        }
        $scope.addNode = function (node) {
            $scope.addingNode = $scope.replaceNodeTypes(node);
            if (node.available === true) {
                $scope.getAvailableDevices(node.nodeID, function (dev) {
                    dev.forEach(function (d) {
                        d.nodes.forEach(function (n) {
                            var nodeType = $scope.replaceNodeTypes(n);
                            n = nodeType;
                        })
                    });
                    $scope.selectedDevice =dev[0].deviceID;
                    $scope.availableNodes = dev;
                    var div = $("#newPanel>div");
                    $("#panels").prepend(div);
                });
            }

        }
        
        $scope.setSelected = function(d){
            $scope.selectedDevice = d;
        }
        
        $scope.getTypes();
    }

    function LayoutController($scope) {
        //Get layouts on boardID.
 $scope.panelWidth = 6;

        $scope.updateData = function () {
            $scope.Data.get({"limit": 1, "sort": -1}, function (d) {
                $scope.data = d.datas;
                var plotData = $scope.parsePlotly(d.datas);
                // make many modifications and redraw
                var graphDiv = document.getElementById("plotly");
                var dat = $scope.parsePlotly(d.datas);
                graphDiv.data[0].x.push(dat[0].x[0]);
                graphDiv.data[0].y.push(dat[0].y[0]);
                graphDiv.layout.showlegend = true;
                console.log(graphDiv.data);
                Plotly.redraw(graphDiv);
            });
        };

        $scope.initData = function (id, graphType, nodeID, width) {
            $scope.plotlyData = [];
            $scope.Data.get({"limit": 30, "nodeID": nodeID}, function (d) {
                $scope.data = d.datas;
                console.log(d);
                $scope.plotlyData = $scope.parsePlotly(d.datas);
                $scope.plotlyData[0].x.reverse();
                $scope.plotlyData[0].y.reverse();
                $scope.plotlyData[0].type = graphType;
                $scope.plotlyLayout = {
                    autosize: false,
                    width: $(".col-xs-" + width + " .panel").width(),
                    height: 250,
                    margin: {
                        l: 20,
                        r: 20,
                        b: 20,
                        t: 20,
                        pad: 0
                    }
                };
                Plotly.newPlot(id, $scope.plotlyData, $scope.plotlyLayout);
            });
        };

//         $scope.initData();
//         $scope.interval($scope.updateData, 5000);
        $scope.parsePlotly = function (data) {
            var plotlyData = [{x: [], y: []}];
            data.forEach(function (n, d) {
                var res = n.created.replace("T", " ");
                var res = res.replace("Z", "");
                plotlyData[0].y.push(n.data[0]);
                plotlyData[0].x.push(res);
            });
            plotlyData[0].type = 'scatter';
            //plotlyData[0].y.push(plotlyData[0].y[plotlyData[0].y.length]);
            return plotlyData;
        }
        
        $scope.panelSize = 6;
        $scope.setPanelSize = function(width){
            $scope.panelSize = width;
        }
        $scope.getNumber = function(n){
             return new Array(n);  
        }
        
         $scope.createLayout = function(layout){
            //$scope.newLayout = layout;
            console.log($scope.layoutFormData);
//                var newLayout = new Layout($scope.layout);
//                newBoard.$save(function(response,err) {
//                   
//                        $scope.setPopup(false);
//                        $scope.addBoard(response);
//                
//                });
            return null;
        }
        
    }

    function checkUserStatus(http, j, s) {
        http.get('api/users/me').success(function (d) {
            if (d == "") {
                j.reLogin();
            } else {
                s.authorized = true;
                s.getBoard();
            }
        });
    }

})();