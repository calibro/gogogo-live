'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:minimap
 * @description
 * # minimap
 */
angular.module('gogogoApp')
  .directive('minimap', function (stats) {
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, element, attrs) {

		var route = JSON.parse(attrs.data)
		var line = []

		route.forEach(function(d){
			var lat = parseFloat(d.coordinates.latitude),
					lon = parseFloat(d.coordinates.longitude);
			line.push([lon, lat])
		})
		
		line = stats.turfLine(line)


        var minimap = gogogo.minimap()
                    .width(100)
                    .height(100)


        var chartMap = d3.select(element[0]).datum(line).call(minimap)

      }
    };
  });
