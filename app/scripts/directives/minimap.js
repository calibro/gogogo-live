'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:minimap
 * @description
 * # minimap
 */
angular.module('gogogoApp')
  .directive('minimap', function () {
    return {
      restrict: 'A',
      replace: false,
      scope: {
        route: '='
      },
      link: function (scope, element, attrs) {

        var route = scope.route,
            width = 100,
            height = 100;

        var canvas = d3.select(element[0]).append("canvas")
            .attr("width", width)
            .attr("height", height);

        var context = canvas.node().getContext("2d");

        var projection = d3.geoMercator().fitSize([width, height], route);

        var path = d3.geoPath()
          .projection(projection)
          .context(context);

        path(route);
        context.stroke();

      }
    };
  });
