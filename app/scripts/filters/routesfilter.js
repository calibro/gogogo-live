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
      var dataIDs = input.map(function(d){return d["_id"]})

      var data = d3.nest()
      				.key(function(d){return d.tm})
      				.key(function(d){return d['tId']})
      				.rollup(function(leaves) {
      					leaves.forEach(function(d){
      						var line = []

      						d.route.forEach(function(e){
      							var lat = e.coord[0],
      									lon = e.coord[1];
      							line.push([lon, lat])
      						})
      						line = stats.turfLine(line)
      						var length = stats.lineDistance(line, 'kilometers')
      						d.kilometers = length

      						var start = parseInt(d.route[0].t),
      								end = parseInt(d.route[d.route.length-1].t),
      								diff = end - start;
      						d.time = stats.minSec(diff)
      					})

      					return leaves

      					})
      				.entries(input)

      return {nested: data, entries: dataLength, ids: dataIDs};
    };
  });
