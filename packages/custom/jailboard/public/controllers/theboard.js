(function(){
   'use strict';
   var app = angular.module('mean.jailboard');
    app.controller('IndexController', TheBoardController);
    TheBoardController.$inject = ['$scope', 'Global', 'Jailboard'];
    function TheBoardController(scope, Global, Jailboard){
     $scope.global = Global;
        $scope.package = {
        name: 'theme'
      };
    }
});