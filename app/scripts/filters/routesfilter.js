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

      var out = [];

      input.forEach(function(d){
        var properties = {
          tm: d.transport_method,
          distance: +d.distance_inkm
        }
        var line = d.route.map(function(r){
          return[
            +r.coordinates.longitude,
            +r.coordinates.latitude
          ]
        })

        out.push(turf.lineString(line, properties))
      })

      out = turf.featureCollection(out)
      
      return out
    };
  });
