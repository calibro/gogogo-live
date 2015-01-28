'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('HomeCtrl', function ($scope, routes, apiService, routesService, fileService, routesFilter ) {

    $scope.routes = routesFilter(routes)

    console.log($scope.routes)
    //add update 30 sec

  });
