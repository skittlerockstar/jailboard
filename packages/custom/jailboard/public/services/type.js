
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Types', Types);

  Types.$inject = ['$resource'];

  function Types($resource) {
    return $resource('api/types/:typeID', {
      typeID: '@typeID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

