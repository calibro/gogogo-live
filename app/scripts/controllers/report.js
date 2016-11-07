'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('ReportCtrl', function ($scope, apiservice, parseSingleTeamFilter) {
    $scope.rawRoutes;
    $scope.routes;
    $scope.reportType = 'all';
    $scope.totalTeams = 0;
    $scope.totalRoutes = 0;
    $scope.dataPoints = 0;

    $scope.checkReport = function(type){
      return $scope.reportType === type;
    }

    apiservice.getRoutesAll()
      .then(function(data){
          $scope.rawRoutes = data;
          $scope.routes = parseSingleTeamFilter(data);
          $scope.totalRoutes = data.length;
          $scope.totalTeams = d3.nest().key(function(d){return d.teamid}).entries(data).length;
          data.forEach(function(d){
            $scope.dataPoints = $scope.dataPoints + d.route.length;
          })
        },function(error){
          $scope.errors = error;
        })
  });
