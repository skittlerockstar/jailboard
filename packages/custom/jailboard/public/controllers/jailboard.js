(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('JailboardController', JailboardController);

  JailboardController.$inject = ['$scope', 'Global', 'Jailboard','MeanUser','$http'];
  
  function JailboardController($scope, Global, Jailboard ,MeanUser, $http) {
      $scope.u = MeanUser;
      console.log(MeanUser);
      $scope.global = Global;
        $scope.package = {
          name: 'jailboasrd'
        };
  }

})();