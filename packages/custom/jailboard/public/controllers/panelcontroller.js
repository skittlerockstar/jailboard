(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('CtrlPanelController', CtrlPanelController);

  CtrlPanelController.$inject = ['$scope','$timeout', 'Global', 'Jailboard'];

  function CtrlPanelController($scope, $timeout, Global, Jailboard) {
    $scope.global = Global;
    $scope.p = {
      name: 'ctrlpanel'
    };
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
})();