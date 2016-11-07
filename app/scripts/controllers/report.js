'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('ReportCtrl', function ($scope, apiservice, parseSingleTeamFilter, parseGridFilter) {
    $scope.rawRoutes;
    $scope.routes;
    $scope.gridFeatures;
    $scope.grid;
    $scope.reportType = 'all';
    $scope.totalTeams = 0;
    $scope.totalRoutes = 0;
    $scope.dataPoints = 0;

    $scope.checkReport = function(type){
      return $scope.reportType === type;
    }
    apiservice.getFile('data/ams_grid.json')
      .then(function(grid){
        $scope.grid = grid;
        apiservice.getRoutesAll()
          .then(function(data){
              $scope.rawRoutes = data;
              $scope.routes = parseSingleTeamFilter(data);
              $scope.totalRoutes = data.length;
              $scope.totalTeams = d3.nest().key(function(d){return d.teamid}).entries(data).length;
              data.forEach(function(d){
                $scope.dataPoints = $scope.dataPoints + d.route.length;
              })
              $scope.gridFeatures = parseGridFilter(data, grid);
            },function(error){
              $scope.errors = error;
            })
      },
      function(error){
        $scope.errors = error;
      }
    )
  });
