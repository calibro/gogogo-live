'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:parseGrid
 * @function
 * @description
 * # parseGrid
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('parseGrid', function () {
    return function (input, grid) {
      var ptFC = [];
      input.forEach(function(route){
        route.route.forEach(function(point){
          ptFC.push(turf.point([+point.coordinates.longitude, +point.coordinates.latitude], {emotion: point.coordinates.emotion}));
        })
      })
      ptFC = turf.featureCollection(ptFC);
      var aggregated = turf.collect(grid, ptFC, 'emotion', 'emotions');
      aggregated.features = aggregated.features.filter(function(feature){
        return feature.properties.emotions.length;
      })

      aggregated.features.forEach(function(feature,i){
        feature.properties.id = 'id_' + i;
        feature.properties.count = feature.properties.emotions.length;
        var mode = d3.nest().key(function(k){return k}).entries(feature.properties.emotions);
        mode = mode.sort(function(a,b){return d3.descending(a.values.length, b.values.length)})
        feature.properties.emotions = mode[0].key;
      })

      return aggregated;
    };
  });
