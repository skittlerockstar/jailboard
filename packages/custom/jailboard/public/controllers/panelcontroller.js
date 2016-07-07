(function () {
    'use strict';

    /* jshint -W098 */
    angular
            .module('mean.jailboard')
            .controller('CtrlPanelController', CtrlPanelController)
            .controller('LayoutController', LayoutController)
            ;

    CtrlPanelController.$inject = ['MeanUser','$interval', 'Nodes', 'Devices', 'Layouts', 'Types', 'Datas', 'Boards', '$stateParams', '$scope', '$timeout', 'Global', 'Jailboard', '$http'];
    LayoutController.$inject = ['$interval', 'Nodes', 'Devices', 'Layouts', 'Types', 'Datas', 'Boards', '$stateParams', '$scope', '$timeout', 'Global', 'Jailboard', '$http'];
    function CtrlPanelController(MeanUser,$interval, Nodes, Devices, Layouts, Types, Datas, Boards, $stateParams, $scope, $timeout, Global, Jailboard, $http) {
        $scope.global = Global;
        $scope.defaultRange = {s:new Date(),e:new Date()};
        $scope.panelController = null;
        $scope.isAdmin = checkUserStatus(MeanUser);
        $scope.rotate = false;
        $scope.collapsed = false;
        $scope.addDataSource = false;
        $scope.authorized = true;
        $scope.board = '';
        $scope.boardID = $stateParams.boardID;
        $scope.Data = Datas;
        $scope.interval = $interval;
        $scope.selectedDevice = "";
        $scope.availableNodes = {};
        $scope.types = {};
        $scope.months = ["Jan","Feb"," Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];
        $scope.addingNode = null;
        $scope.editMode = false;
        $scope.getter = function (prop) {
            return $scope[prop];
        };
        $scope.setter = function (prop, val) {
            console.log($scope[prop]);
            $scope[prop] = val;
             console.log($scope[prop]);
        };
        $scope.init = function(){
            $scope.getBoard();
            console.log(Chart.defaults);
        }
//     $scope.animDelay = function () {
//            if (this.collapsed != this.rotate) {
//                if (this.rotate == null) {
//                    this.rotate = this.collapsed;
//                } else {
//                    this.rotate = null;
//                    $timeout(function () {
//                        $scope.rotate = $scope.collapsed;
//                    }, 100);
//                }
//            }
//        };

        $scope.getLayouts = function () {
            Layouts.get({"boardID": $scope.boardID}, function (b) {
                $scope.layouts = b.layouts;
                console.log(b);
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


        $scope.updateLayout = function (layout) {
            var l = jQuery.extend(true,{}, layout);
            layout.chart.data.datasets[0].label = l.valueType;
            layout.chart.update();
            delete l.chart;
            Layouts.update(l);
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

        $scope.hoveringPanel = null;
//        $scope.updateData = function () {
//            if($scope.layouts !== 'undefined'){
//            $scope.layouts.forEach(function (layout) {
//                if ($scope.hoveringPanel === layout._id)
//                    return;
//                $scope.Data.get({"limit": 20, "sort": -1, "nodeID": layout.nodeID}, function (d) {
//                   var chartData = layout.chart.chart.config.data;
//                   var pd = $scope.parsePlotly(d.datas);
//                   var test = pd[0].x.indexOf(chartData.labels[chartData.labels.length-1]);
//                   if(test <= 0){return;}else{
//                       pd[0].x= pd[0].x.slice(0, test);
//                       pd[0].y=pd[0].y.slice(0, test);
//                      
//                       chartData.labels = chartData.labels.slice(pd[0].y.length, chartData.datasets[0].length);
//                       chartData.datasets[0].data = chartData.datasets[0].data.slice(pd[0].y.length, chartData.datasets[0].data.length);
//                       chartData.labels = chartData.labels.concat(pd[0].x);
//                       chartData.datasets[0].data = chartData.datasets[0].data.concat(pd[0].y);
//                        chartData.datasets[0].backgroundColor = $scope.getColor(chartData.datasets[0].data);
//                       layout.chart.update();
//                    }
//                    
//                });
//            });
//        }
//        };
        $scope.getColor = function (n) {
                    var cd = [];
                    var highest = 100;//Math.max.apply(Math, n);
                    n.forEach(function (v) {
                        var R = Math.floor((255 * v) / highest)
                                , B = Math.floor((255 * (highest - v)) / highest);
                        cd.push('rgba('+R+',0,'+B+',.8)');
                    });
                    console.log(cd);
                    return cd;
                };
        $scope.initPanelEvents = function (id) {
            $timeout(function () {
                $("#" + id).parent().hover(function () {
                    $scope.hoveringPanel = id;
                }, function () {
                    $scope.hoveringPanel = null;
                });
            }, 200);
        }

//         $scope.initData();
//        $scope.interval($scope.updateData, 3000);

        $scope.parsePlotly = function (data) {
            var plotlyData = [{x: [], y: []}];
            data.forEach(function (n, d) {
                var res = n.created;
                plotlyData[0].y.push(n.data[0]);
                var date = Date.parse(res);
                date = new Date(date);
                var labels = date.getDate()+" "+$scope.months[date.getMonth()-1]+" "+ date.getFullYear()+" "+date.getHours() + ":" + date.getMinutes()+":"+date.getSeconds();
                plotlyData[0].x.push(labels);
            });
            plotlyData[0].type = 'scatter';
            return plotlyData;
        }
        $scope.setActivePanel = function (l) {
            $scope.removeNewPanel();
            $scope.activePanel = l;
            $scope.oldLayout = jQuery.extend({}, l);
            var pos = $('.'+l._id).position();
            $scope.setter('editMode', true);
            $('#displaySizer').css({'zIndex':9999,top:pos.top-75,height:0});
        }
        $scope.removeNewPanel = function () {
            $scope.setter("addingNode", null);
        }
        $scope.setPanelSize = function (width) {
            if ($scope.addingNode == null) {
                var layout = $scope.layouts[$scope.layouts.indexOf($scope.activePanel)];
//                $scope.relayout(layout, width);
                layout.width = width;
            } else {
                $scope.newPanel.width = width;
            }
        }
        $scope.setGraphType = function(layout,type){
            console.log(layout);
            var t = layout;
            t.graphType = type;
            t.chart.type= type;
            layout.chart.destroy();
             $scope.getter('panelController')['initGraph'](t);
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
//            $scope.relayout($scope.oldLayout);
        }
        $scope.getNumber = function (n) {
            return new Array(n);
        }

        $scope.createLayout = function (layout) {
            var newLayout = new Layouts($scope.newPanel);
            newLayout.boardID = $scope.boardID;
            console.log($('.selectedNode input')[0].value);
            newLayout.nodeID = $('.selectedNode input')[0].value;
            newLayout.$save(function (response, err) {
                $scope.layouts.push(response);
                $scope.setter('addingNode', null);
                $scope.setter('editMode', false);
                $scope.getter('panelController')['initGraph'](response);
            });
            return null;
        }
        $scope.setSelected = function (d, cls) {
            $("." + cls, d.currentTarget).prop('checked', true);
            $scope.selectedDevice = cls;
            $scope.selectedNode = $(".selectedNode input", d.currentTarget.context)[0].value;
        }
        $scope.saveAsPng = function(layout,callback){
            var canvas = $('.'+layout._id+" canvas")[0];
            var ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation='destination-over';
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            
            var myImage = canvas.toDataURL("image/jpeg", 10.0);
            $('.'+layout._id+" .saveImage")[0].href = myImage;
             $('.'+layout._id+" .saveImage")[0].download = 'myImage.jpeg';
             //ctx.clearRect(0, 0, canvas.width, canvas.height);
             $timeout(function(){
                 layout.chart.destroy();
                 $scope.panelController.initGraph(layout);
             },500);
        }
        $scope.pickDate = function(layout){
            $("#dateFrom").datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 3,
                onClose: function (selectedDate) {
                    $("#dateTo").datepicker("option", "minDate", selectedDate);
                    $scope.defaultRange.s = new Date(selectedDate);
                    $scope.Data.get({"created": {"$gte": $scope.defaultRange.s, "$lt": $scope.defaultRange.e},"limit": 100, "sort": -1, "nodeID": layout.nodeID}, function (d) {
                      $scope.getter('panelController').updateGraph(layout,d.datas);
                  });
                }
            });
            $("#dateTo").datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 3,
                onClose: function (selectedDate) {
                    $("#dateFrom").datepicker("option", "maxDate", selectedDate);
                    $scope.defaultRange.e = new Date(selectedDate);
                  $scope.Data.get({"created": {"$gte": $scope.defaultRange.s, "$lt": $scope.defaultRange.e},"limit": 100, "sort": -1, "nodeID": layout.nodeID}, function (d) {
                      $scope.getter('panelController').updateGraph(layout,d.datas);
                  });
                }
            });
             $("#date").show();
                  $("#dateFrom").focus();
           
        }
        $scope.deleteLayout = function (layout) {
            var c = confirm("Are you sure you want to delete " + layout.title);
            if (c) {
                var graphs = $('canvas');
                var prev = $scope.layouts.indexOf(layout);
                $(graphs[prev]).detach();
                var g2 = $(graphs[prev+1]).detach();
                var newL = jQuery.extend(true,{}, layout);
                delete newL.chart;
                Layouts.remove(newL, function (response) {
                    var index = $scope.layouts.indexOf(layout);
//                   
                    console.log($scope.layouts[1]._id);
                    $('.'+$scope.layouts[1]._id+' .graphContainer.panel-body').append(g2);
                     $scope.layouts.splice(index, 1);
                });
            }
        }


    }

    function checkUserStatus(MeanUser) {
          if($.inArray('admin',MeanUser.user.roles) >=0 || $.inArray('developer',MeanUser.user.roles) >= 0 ) {return true;}
            else {return false;}
//        http.get('api/users/me').success(function (d) {
//            console.log(d);
//            if (d == "") {
//                j.reLogin();
//            } else {
//                s.authorized = true;
//                s.getBoard();
//            }
//        });
    }

})();