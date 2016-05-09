
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Data', Data);

  Data.$inject = ['$resource'];

  function Data($resource) {
    return $resource('api/data/:dataID', {
      dataID: '@dataID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

