(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('JailboardController', JailboardController);

  JailboardController.$inject = ['$scope', 'Global', 'Jailboard'];
  
  function JailboardController($scope, Global, Jailboard) {
  
      $scope.global = Global;
    $scope.package = {
      name: 'jailboard'
    };
  }
})();