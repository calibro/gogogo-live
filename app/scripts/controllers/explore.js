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
    $scope.singleRoute,
    $scope.teams,
    $scope.errors;
    $scope.filters = {
      bike: true,
      walking: true,
      selectedTeam: '',
      minValue:'',
      maxValue:''
    };
    $scope.isCollapsed = true;

    var dateFormat = d3.timeFormat("%d/%m %H:%M");
    $scope.slider = {
      minValue: 0,
      maxValue: 0,
      options: {
          ceil:0,
          floor:0,
          step:1000*60,
          noSwitching:true,
          translate: function(value) {
            return dateFormat(new Date(value));
          },
          onEnd: function(sliderId, modelValue, highValue, pointerType){
            if(pointerType == 'min'){
                $scope.filters.minValue = modelValue;
            }else{
                $scope.filters.maxValue = highValue;
            }
          },
      }
    };

    $scope.onSelectedTeam = function(item, model, label, event){
      $scope.filters.selectedTeam = item;
    }

    $scope.removeTeam = function(){
      $scope.filters.selectedTeam = '';
    }

    $scope.removeSingleRoute = function() {
      $scope.singleRoute = null;
    }

    $scope.getSingleRoute = function(teamid, routeid){
      apiservice.getSingleRoute(teamid, routeid)
        .then(function(data){
          $scope.singleRoute = data;
        },function(error){
          $scope.errors = error;
        });
    }

    apiservice.getRoutes()
      .then(function(data){
          $scope.routes = data.routes;
          $scope.teams = data.teams;
          $scope.teamsList = data.teamsList;
          $scope.slider.minValue = data.dates[0];
          $scope.filters.minValue = data.dates[0];
          $scope.slider.options.floor = data.dates[0];
          $scope.slider.maxValue = data.dates[1];
          $scope.filters.maxValue = data.dates[1];
          $scope.slider.options.ceil = data.dates[1];
        },function(error){
          $scope.errors = error;
        })
  });
