(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Jailboard', Jailboard);

  Jailboard.$inject = [];

  function Jailboard() {
    return {
      name: 'jailboard'
    };
  }
})();
