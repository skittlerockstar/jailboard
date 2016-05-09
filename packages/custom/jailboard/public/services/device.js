
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Devices', Devices);

  Devices.$inject = ['$resource'];

  function Devices($resource) {
    return $resource('api/devices/:deviceID', {
      deviceId: '@deviceID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

