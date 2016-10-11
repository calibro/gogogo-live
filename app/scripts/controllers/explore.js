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
    $scope.errors;

    apiservice.getRoutes()
      .then(function(data){
          $scope.routes = data;
          console.log(data)
        },function(error){
          $scope.errors = error;
        })
  });
