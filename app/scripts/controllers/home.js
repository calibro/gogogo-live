'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('HomeCtrl', function ($scope, $window, routes, routesFilter, routesService ) {

    $scope.routes = routes
    $scope.windowHeight = ($window.innerHeight - 48 - 74) + 'px';

    $scope.lastNofRoutes = 10;
    $scope.lastNofTeams = 10;
    $scope.search = {};

    $scope.selectedIndex = 0;
    $scope.selectedTab = $scope.routes[$scope.selectedIndex].key;
    $scope.selectedTeam;

    //routesService.update(5000);

    $scope.teamSubmit = function(team){
        $scope.selectedTeam = team
    }

    console.log($scope.routes);
    //add update 30 sec

  });
