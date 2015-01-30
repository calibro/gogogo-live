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
      turfLine: function(points){
        var line = turf.linestring(points);
        return line
      },
      minSec: function(diff){
        var seconds = diff/1000;
        var minutes = seconds/60;
        return {seconds: seconds, minutes: minutes}
      }
    };
  });
