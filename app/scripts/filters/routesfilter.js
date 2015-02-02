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
  .filter('routes', function (stats) {
    return function (input) {

      var dataLength = input.length;

      var data = d3.nest()
      				.key(function(d){return d.transport_method})
      				.key(function(d){return d.teamid})
      				.rollup(function(leaves) {
      					leaves.forEach(function(d){
      						var line = []

      						d.route.forEach(function(e){
      							var lat = parseFloat(e.coordinates.latitude),
      									lon = parseFloat(e.coordinates.longitude);
      							line.push([lon, lat])
      						})
      						line = stats.turfLine(line)
      						var length = stats.lineDistance(line, 'kilometers')
      						d.kilometers = length

      						var start = parseInt(d.route[0].timestamp),
      								end = parseInt(d.route[d.route.length-1].timestamp),
      								diff = end - start;
      						d.time = stats.minSec(diff)
      					})

      					return leaves

      					})
      				.entries(input)

      return {nested: data, entries: dataLength};
    };
  });
