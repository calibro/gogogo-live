'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:parseTitles
 * @function
 * @description
 * # parseTitles
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('parseTitles', function () {
    return function (input) {

      return input.replace("_", " ");
    };
  });
