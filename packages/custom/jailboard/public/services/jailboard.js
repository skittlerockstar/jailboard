(function () {
  'use strict';

  angular
    .module('mean.jailboard')
    .factory('Jailboard', Jailboard);

  Jailboard.$inject = ['$window'];

  function Jailboard($window) {
      var reLogin = function(){
            if($window.location.href !="http://localhost:3000/auth/login"){
              $window.location.href='/auth/login';
            }
      };
      return {
         reLogin:reLogin
      }
  }
})();
