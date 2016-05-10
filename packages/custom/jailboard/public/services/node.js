
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Nodes', Nodes);

  Nodes.$inject = ['$resource'];

  function Nodes($resource) {
    return $resource('api/nodes/:nodeID', {
      nodeID: '@nodeID'
    }, {
      update: {
        method: 'PUT'
      },
      count: {
          url:'api/nodes/count',
          method:'GET'
      }
    });
  }
})();

