
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Datas', Data);

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

