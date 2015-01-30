'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:map
 * @description
 * # map
 */
angular.module('gogogoApp')
  .directive('map', ['$timeout', '$window','stats', function ($timeout, $window, stats){
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, element, attrs) {

      	//set height for map container
	    d3.select(element[0]).attr('style', 'height:' + $window.innerHeight + 'px')
	    

	    var mapTeam = L.map(
	     	element[0],
	     	{maxBounds: [[52.2829,4.7948],[52.4476,5.0187]]}
	     	).setView([52.3667, 4.9000], 13);

	    var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
		  	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
		    attributionControl: false,
		    infoControl: true,
		    minZoom:12,
		    maxZoom:17
		}).addTo(mapTeam);

		var svg = d3.select(mapTeam.getPanes().overlayPane).append("svg"),
		    g = svg.append("g").attr("class", "leaflet-zoom-hide");

		var transform = d3.geo.transform({point: projectPoint}),
      		path = d3.geo.path().projection(transform);
		
		var data = scope.routes.filter(function(d){return d.key == "walking"}),
			featuresPoint = [],
			featuresLine = [],
			radius = 5;

		data[0].values.forEach(function(d){

			var lastRoute = d.values[d.values.length -1],
				teamId = lastRoute.teamid,
				lat = parseFloat(lastRoute.route[lastRoute.route.length -1].coordinates.latitude),
      			lon = parseFloat(lastRoute.route[lastRoute.route.length -1].coordinates.longitude),
      			timestamp = lastRoute.route[lastRoute.route.length -1].timestamp

			var line = [];

			lastRoute.route.forEach(function(e){
				var lat = parseFloat(e.coordinates.latitude),
					lon = parseFloat(e.coordinates.longitude);
				line.push([lon, lat])
			})
				
			
			line = stats.turfLine(line, {team:teamId})


			var point = turf.point([lon, lat], {team:teamId, timestamp: timestamp})

			featuresPoint.push(point)
			featuresLine.push(line)

		})


		var mapData = turf.featurecollection(featuresPoint),
			mapDataLine = turf.featurecollection(featuresLine);

			console.log(mapDataLine)

        var team = g.selectAll(".teams").data(mapData.features, function(d){return d.properties.team})
          
         team.enter()
          .append("path")
          .attr("class", "teams")
          .attr("fill", "#FFE100")
          .attr("fill-opacity", 0.9)
          .attr("stroke", "black")

        var line = g.selectAll(".line").data(mapDataLine.features, function(d){return d.properties.team})
          
         line.enter()
          .append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "#FFE100")
          .attr("stroke-width", "3px")
          .attr("stroke-opacity", 0.7)




  		mapTeam.on("viewreset", reset);
  		reset();

	      // Reposition the SVG to cover the features.
		  function reset() {
		  	path.pointRadius(radius);

		    var bounds = path.bounds(mapData),
		        topLeft = bounds[0],
		        bottomRight = bounds[1];
		    svg .attr("width", bottomRight[0] - topLeft[0] + (radius*2))
		        .attr("height", bottomRight[1] - topLeft[1] + (radius*2))
		        .style("left", topLeft[0] + "px")
		        .style("top", topLeft[1] + "px");

		    g.attr("transform", "translate(" + (-topLeft[0] + radius) + "," + (-topLeft[1] + radius) + ")");
		    
		    team.attr("d", path);
		    line.attr("d", path);
		  }
		  // Use Leaflet to implement a D3 geometric transformation.
		  function projectPoint(x, y) {
		    var point = mapTeam.latLngToLayerPoint(new L.LatLng(y, x));
		    this.stream.point(point.x, point.y);
		  }

		 var upadate = function(){
		 	
			team
		        .transition()
		        .duration(duration)
		        .attr("d", path)
		 }

		scope.$watch('routes', function(newValue, oldValue){
          if(newValue != oldValue){
              console.log("ciao")
              //upadate()
          }
        }, true)

      }
    };
  }]);
