(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('CtrlPanelController', CtrlPanelController);

  CtrlPanelController.$inject = ['$scope','$timeout', 'Global', 'Jailboard', '$http'];

  function CtrlPanelController($scope, $timeout, Global, Jailboard, $http) {
      $scope.global = Global;
    $scope.p = {
      name: 'ctrlpanel'
    };
        $scope.authorized = false;
    checkUserStatus($http,Jailboard,$scope);
    $scope.rotate = false;
    $scope.collapsed = true;
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
  }
  
    function checkUserStatus(http,j,s){
      http.get('api/users/me').success(function (d) {
        if(d == ""){j.reLogin();}
        else{
            s.authorized = true;
        }
      });
  }
  
})();