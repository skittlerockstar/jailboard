
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Permissions', Permissions);

  Permissions.$inject = ['$resource'];

  function Permissions($resource) {
    return $resource('api/permissions/:permissionID', {
      permissionID: '@permissionID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

