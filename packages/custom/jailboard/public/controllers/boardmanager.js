(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.jailboard')
    .controller('BoardManagerController', BoardManagerController);

  BoardManagerController.$inject = ['$scope', 'Global','Devices', 'Jailboard','MeanUser','$http'];
  
  function BoardManagerController($scope, Global,Devices, Jailboard ,MeanUser, $http) {
      $scope.global = Global;
        $scope.popup = false;
        console.log(new Devices());
        $scope.create = function() {
          // $scope.article.permissions.push('test test');
          var device = new Devices($scope.article);

          device.$save(function(response) {
            $location.path('boards/' + response._id);
          });

          $scope.article = {};

      };
  }

})();
