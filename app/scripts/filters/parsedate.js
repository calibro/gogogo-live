'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:parseDate
 * @function
 * @description
 * # parseDate
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('parseDate', function () {
    return function (input) {
    	var format = d3.time.format("%A %X");
      return format(new Date(parseInt(input)));
    };
  });
