'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
