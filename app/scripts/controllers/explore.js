'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('ExploreCtrl', function ($scope, apiservice) {
    $scope.routes,
    $scope.teams,
    $scope.errors;
    $scope.filters = {
      bike: true,
      walking: true,
      selectedTeam: false
    };

    var dateFormat = d3.timeFormat("%d/%m %H:%M");
    $scope.slider = {
      minValue: 0,
      maxValue: 0,
      options: {
          ceil:0,
          floor:0,
          step:1000*60,
          translate: function(value) {
          return dateFormat(new Date(value));
        }
      }
    };

    $scope.onSelectedTeam = function(item, model, label, event){
      $scope.filters.selectedTeam = item;
    }

    $scope.removeTeam = function(){
      $scope.filters.selectedTeam = false;
    }

    apiservice.getRoutes()
      .then(function(data){
          $scope.routes = data.routes;
          $scope.teams = data.teams;
          $scope.slider.minValue = data.dates[0];
          $scope.slider.options.floor = data.dates[0];
          $scope.slider.maxValue = data.dates[1];
          $scope.slider.options.ceil = data.dates[1];
        },function(error){
          $scope.errors = error;
        })
  });
