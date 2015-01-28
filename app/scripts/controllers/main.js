'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
