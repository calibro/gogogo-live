'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('HomeCtrl', function ($scope, $window, routes, routesFilter ) {

    //$scope.routes = routesFilter(routes);
    $scope.routes = routes
    $scope.windowHeight = ($window.innerHeight - 48 - 64) + 'px';

    $scope.lastNofRoutes = 10;
    $scope.lastNofTeams = 10;
    $scope.search = {};


    console.log($scope.routes);
    //add update 30 sec

  });
