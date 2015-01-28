'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:routesFilter
 * @function
 * @description
 * # routesFilter
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('routes', function () {
    return function (input) {
      var data = d3.nest()
      				.key(function(d){return d.transport_method})
      				.key(function(d){return d.teamid})
      				.entries(input)
      				
      return data;
    };
  });
