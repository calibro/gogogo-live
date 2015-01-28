'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('MainCtrl', function ($scope, api, routesData ) {

    //$scope.routes = routesData.update()

    console.log(api.getRoutes())

  });
