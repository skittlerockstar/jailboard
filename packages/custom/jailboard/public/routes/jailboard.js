(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .config(jailboard);

  jailboard.$inject = ['$stateProvider'];

  function jailboard($stateProvider) {
    $stateProvider.state('jailboard', {
      url: '/jailboard/example',
      templateUrl: 'jailboard/views/index.html',
      requiredCircles: {
          circles: ['admin']
        }
    });
    $stateProvider.state('Node red', {
      url: '/api/jailboard/red',
      templateUrl: '/api/jailboard',
      href:'http://localhost:3000/api/jailboard/red',
      requiredCircles: {
          circles: ['admin']
        }
    });
  }

})();
