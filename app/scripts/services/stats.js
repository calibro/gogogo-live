'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.stats
 * @description
 * # stats
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('stats', function () {

    return {
      lineDistance: function (line, units) {
        var length = turf.lineDistance(line, units);
        return length;
      },
      turfLine: function(points, prop){
        var line = turf.linestring(points, prop);
        return line
      },
      minSec: function(diff){
        var minutes = ~~((diff/1000) / 60);
        var seconds = parseInt((diff/1000) % 60);
        return {seconds: seconds, minutes: minutes}
      }
    };
  });
