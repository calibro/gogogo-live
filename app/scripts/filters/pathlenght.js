'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:pathlenght
 * @function
 * @description
 * # pathlenght
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('pathlenght', function () {
    return function (input) {
      
      var lenght = parseFloat(input);
      return lenght < 1 ? d3.format(".2f")(lenght*1000) + '<span class="merry">m</span>' : d3.format(".2f")(lenght) + '<span class="merry">km</span>'
    };
  });
