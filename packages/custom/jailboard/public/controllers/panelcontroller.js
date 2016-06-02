(function () {
    'use strict';

    /* jshint -W098 */
    angular
            .module('mean.jailboard')
            .controller('CtrlPanelController', CtrlPanelController)
            .controller('LayoutController', LayoutController)
            ;

    CtrlPanelController.$inject = ['$interval', 'Nodes', 'Devices', 'Layouts', 'Types', 'Datas', 'Boards', '$stateParams', '$scope', '$timeout', 'Global', 'Jailboard', '$http'];
    LayoutController.$inject = ['$interval', 'Nodes', 'Devices', 'Layouts', 'Types', 'Datas', 'Boards', '$stateParams', '$scope', '$timeout', 'Global', 'Jailboard', '$http'];

    function CtrlPanelController($interval, Nodes, Devices, Layouts, Types, Datas, Boards, $stateParams, $scope, $timeout, Global, Jailboard, $http) {
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
        $scope.addingNode = null;
        $scope.editMode = false;
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
                    $scope.selectedDevice = dev[0].deviceID;
                    $scope.availableNodes = dev;
                });
                $scope.editMode = true;
            }
        }

        $scope.setSelected = function (d , cls) {
         $("."+cls,d.currentTarget).prop('checked', true);
         $scope.selectedDevice = cls;
        }
        $scope.updateLayout = function (layout) {
            Layouts.update(layout);
        }
        $scope.getTypes();
    }

    function LayoutController($interval, Nodes, Devices, Layouts, Types, Datas, Boards, $stateParams, $scope, $timeout, Global, Jailboard, $http) {
        $scope.newPanel = {
            width: null,
            deviceID: null,
            title: null,
            boardID: $scope.boardID,
            nodeID: null,
        };
        $scope.initSizes = {};
     
        $scope.hoveringPanel = null;
        $scope.updateData = function () {
            
            $scope.layouts.forEach(function(layout){
                if($scope.hoveringPanel === layout._id) return;
                $scope.Data.get({"limit": 100, "sort": -1,"nodeID":layout.nodeID}, function (d) {
                    if(d.datas.length === 0) return;
                    $scope.data = d.datas;
                    var plotData = $scope.parsePlotly(d.datas);
                    // make many modifications and redraw
                    var graphDiv = document.getElementById(layout._id);
                    var dat = $scope.parsePlotly(d.datas);
                    var rangeB = graphDiv.data[0].x.length-1;
                    var rangeE = graphDiv.data[0].x.length-30;
                    if(dat[0].x[0] !== graphDiv.data[0].x[graphDiv.data[0].x.length-1]){
                    dat.forEach(function(d){
                        var last = graphDiv.data[0].x[rangeB];
                        d.x.reverse();
                        d.y.reverse();
                        d.x.forEach(function(dx,i){
                            var tn = Date.parse(dx);
                            var to = Date.parse(last);
                            
                            if(tn > to ) {
                                graphDiv.data[0].y.push(dat[0].y[i]);
                                graphDiv.data[0].x.push(dx);
                            }else return;
                        });
                    });
                    
                    rangeB = Date.parse(graphDiv.data[0].x[rangeB]);
                    rangeE = Date.parse(graphDiv.data[0].x[rangeE]);
                    graphDiv.layout.xaxis = {range: [rangeE, rangeB]};
                    console.log('testing');
                    Plotly.redraw(graphDiv);
                }
                });
            });
        };

        $scope.initData = function (id, graphType, nodeID, width) {
            $scope.plotlyData = [];
             $scope.initPanelEvents(id);
            $scope.Data.get({"limit": 100, "nodeID": nodeID}, function (d) {
                $scope.data = d.datas;
                $scope.plotlyData = $scope.parsePlotly(d.datas);
                $scope.plotlyData[0].x.reverse();
                $scope.plotlyData[0].y.reverse();
                $scope.plotlyData[0].type = graphType;
                $scope.initSizes[id] = $("#" + id)[0].getBoundingClientRect().width / width;
                var w = $scope.initSizes[id];
                if (d.datas.length != 0) {
                    $scope.plotlyLayout = {
                        autosize: true,
                        width: w * width - 2,
                        height: 250,
                        margin: {
                            l: 25,
                            r: 0,
                            b: 40,
                            t: 20,
                            pad: 0
                        },
                    };
                    Plotly.newPlot(id, $scope.plotlyData, $scope.plotlyLayout);
                }
            });
        };
        $scope.initPanelEvents = function(id){
             $timeout(function () {
            $("#"+id).parent().hover(function(){
                $scope.hoveringPanel = id;
            },function(){
                $scope.hoveringPanel = null;
            });
            },200);
        }
        $scope.relayout = function (layout, width) {
            $("#" + layout._id).css({opacity:0});
            $timeout(function () {
                var w = $("#" + layout._id)[0].getBoundingClientRect().width -2;
                var update = {
                    width: w
                }
                Plotly.relayout(layout._id, update);
               $("#" + layout._id).css({opacity:1});
            }, 200);

        }
//         $scope.initData();
  
         $scope.interval($scope.updateData, 1000);
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
        $scope.setActivePanel = function (l) {
            $scope.removeNewPanel();
            $scope.activePanel = l;
            $scope.oldLayout = jQuery.extend({}, l);
            $scope.setter('editMode', true);
        }
        $scope.removeNewPanel = function () {
            $scope.setter("addingNode", null);
        }
        $scope.setPanelSize = function (width) {
            if ($scope.addingNode == null) {
                var layout = $scope.layouts[$scope.layouts.indexOf($scope.activePanel)];
                $scope.relayout(layout, width);
                layout.width = width;
            } else {
                $scope.newPanel.width = width;
            }
        }
        $scope.saveLayout = function (layout) {
            $scope.oldLayout = layout;
            $scope.updateLayout($scope.oldLayout);
            $scope.exitEditMode(layout);
        }
        $scope.exitEditMode = function (layout) {
            var editedLayout = $scope.layouts[$scope.layouts.indexOf($scope.activePanel)] = $scope.oldLayout;
            $scope.activePanel = null;
            $scope.setter('editMode', false);
            $scope.relayout($scope.oldLayout);
        }
        $scope.getNumber = function (n) {
            return new Array(n);
        }

        $scope.createLayout = function (layout) {
            var newLayout = new Layouts($scope.newPanel);
            newLayout.boardID = $scope.boardID;
            newLayout.$save(function (response, err) {
                $scope.layouts.push(response);
                $scope.addingNode = null;
            $scope.setter('editMode', false);
            });
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