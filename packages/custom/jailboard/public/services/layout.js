
(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Layouts', Layouts);

  Layouts.$inject = ['$resource'];

  function Layouts($resource) {
    return $resource('api/layouts/:layoutID', {
      layoutID: '@layoutID'
    }, {
      update: {
        method: 'PUT'
      },
      board:{
          method:"GET",
          url:"api/layouts/:boardID/:nodeID/:deviceID",
          boardID:"@boardID",
          deviceID:"@deviceID",
          nodeID:"@nodeID"
      }
    });
  }
})();

