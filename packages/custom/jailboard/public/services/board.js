
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Boards', Boards);

  Boards.$inject = ['$resource'];

  function Boards($resource) {
    return $resource('api/boards/:boardID', {
      boardID: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

