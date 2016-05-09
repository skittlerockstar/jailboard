
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Sensors', Sensors);

  Sensors.$inject = ['$resource'];

  function Sensors($resource) {
    return $resource('api/sensors/:sensorID', {
      sensorID: '@sensorID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

