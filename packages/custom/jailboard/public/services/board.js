
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Boards', Boards);

  Boards.$inject = ['$resource'];

  function Boards($resource) {
    return $resource('api/board/:boardID', {
      boardID: '@boardID'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

