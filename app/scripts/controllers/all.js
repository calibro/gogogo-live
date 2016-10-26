'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:AllCtrl
 * @description
 * # AllCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('AllCtrl', function ($scope, apiservice) {
    $scope.routes;

    apiservice.getRoutesAll()
      .then(function(data){
          $scope.routes = data;
          console.log(data)
        },function(error){
          $scope.errors = error;
        })
  });
