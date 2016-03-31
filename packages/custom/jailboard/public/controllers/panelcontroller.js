(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('CtrlPanelController', CtrlPanelController);

  CtrlPanelController.$inject = ['$scope', 'Global', 'Jailboard'];

  function CtrlPanelController($scope, Global, Jailboard) {
    $scope.global = Global;
    $scope.p = {
      name: 'ctrlpanel'
    };
  }
})();