(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .config(jailboard).config(['$viewPathProvider', function($viewPathProvider) {
  $viewPathProvider.override('system/views/index.html', 'jailboard/views/index.html');
}]);


  jailboard.$inject = ['$stateProvider'];

  function jailboard($stateProvider) {
    $stateProvider.state('Jailboard', {
      url: '/Jailboard',
      templateUrl: './jailboard/views/index.html',
      requiredCircles: {
          circles: ['topkek']
        }
    });
    $stateProvider.state('index', {
      url: '/auth/login',
      templateUrl: './jailboard/views/index.html',
      requiredCircles: {
          circles: ['admin']
        }
    });
    $stateProvider.state('redirect', {
      url: '/rdr',
      templateUrl: './jailboard/views/rdr.html',
      requiredCircles: {
          circles: ['topkek']
        }
    });
    $stateProvider.state('Node red', {
      url: '/api/jailboard/red',
      templateUrl: '/api/jailboard',
      href:'http://localhost:3000/api/jailboard/red',
      requiredCircles: {
          circles: ['admin','authorized']
        }
    });
  }

})();
