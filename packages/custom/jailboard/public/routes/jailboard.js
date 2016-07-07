(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .config(jailboard).config(['$viewPathProvider', function($viewPathProvider) {
        $viewPathProvider.override('system/views/index.html', 'jailboard/views/boards.html');
}]);


  jailboard.$inject = ['$stateProvider'];

  function jailboard($stateProvider) {
    $stateProvider.state('board by id', {
      url: '/boards/:boardID',
      templateUrl: './jailboard/views/index.html',
    });
    $stateProvider.state('index', {
      url: '/auth/login',
      templateUrl: './jailboard/views/index.html',
      requiredCircles: {
          circles: ['admin']
        }
    });
    $stateProvider.state('boards', {
      url: '/boards',
      templateUrl: './jailboard/views/boards.html',
      requiredCircles: {
          circles: ['authorized']
        }
    });
    $stateProvider.state('data', {
      url: '/data',
      templateUrl: './jailboard/views/data.html',
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
