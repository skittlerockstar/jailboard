(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('JailboardController', JailboardController);

  JailboardController.$inject = ['$scope', 'Global', 'Jailboard','MeanUser','$http'];
  
  function JailboardController($scope, Global, Jailboard ,MeanUser, $http) {
      $scope.global = Global;
        $scope.package = {
          name: 'jailboasrd'
        };
        
  }

})();