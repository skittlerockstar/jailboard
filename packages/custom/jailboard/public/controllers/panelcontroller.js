(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('CtrlPanelController', CtrlPanelController)
    .controller('LayoutController', LayoutController)
    ;

  CtrlPanelController.$inject = ['Boards','$stateParams','$scope','$timeout', 'Global', 'Jailboard', '$http'];

  function CtrlPanelController(Boards,$stateParams,$scope, $timeout, Global, Jailboard, $http) {
      $scope.global = Global;
    $scope.authorized = false;
    checkUserStatus($http,Jailboard,$scope);
    $scope.rotate = false;
    $scope.collapsed = false;
    $scope.addDataSource = false;
    $scope.board = '';
    $scope.getter = function(prop){
        return $scope[prop];
    };
    $scope.setter = function(prop,val){
        $scope[prop] = val;
    };
    $scope.animDelay = function(){
        if(this.collapsed != this.rotate){
            if(this.rotate == null){
                this.rotate = this.collapsed;
            }else{
                this.rotate = null;
              $timeout(function(){$scope.rotate = $scope.collapsed;}, 100);
            }
        }
    };
    
    $scope.getBoard = function(){
      Boards.get({
        boardID: $stateParams.boardID
      }, function(b) {
        $scope.board = b.board;
      });
    }
    
  }
  
  function LayoutController($scope){
      
  }
  
    function checkUserStatus(http,j,s){
      http.get('api/users/me').success(function (d) {
        if(d == ""){j.reLogin();}
        else{
            s.authorized = true;
            s.getBoard();
        }
      });
  }
  
})();