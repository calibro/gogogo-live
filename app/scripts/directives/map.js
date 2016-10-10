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
	    d3.select(element[0]).attr('style', 'height:' + ($window.innerHeight-60) + 'px')

	    var duration = 1000,
	    	linePath,
	    	team,
	    	mapData,
	    	mapDataLine;


	    var mapTeam = L.map(
	     	element[0]//,
	     	//{maxBounds: [[52.2829,4.7948],[52.4476,5.0187]]}
	     	).setView([52.3667, 4.9000], 13);

	    var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
		  	attribution: '<a href="http://stamen.com">Stamen Design</a> | <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    attributionControl: false,
		    infoControl: true,
		    minZoom:8,
		    maxZoom:17
		}).addTo(mapTeam);

		var svg = d3.select(mapTeam.getPanes().overlayPane).append("svg"),
		    g = svg.append("g").attr("class", "leaflet-zoom-hide");

		var transform = d3.geo.transform({point: projectPoint}),
      		path = d3.geo.path().projection(transform);

      	if(scope.errors){
      		return;
      	}

		var data = scope.routes.filter(function(d){return d.key == scope.selectedTab}),
			featuresPoint = [],
			featuresLine = [],
			radius = 5;

		data[0].values.forEach(function(d){
			var lastRoute = d.values[d.values.length -1],
				teamId = lastRoute['tId'],
				lat = lastRoute.route[lastRoute.route.length -1].coord[0],
      			lon = lastRoute.route[lastRoute.route.length -1].coord[1],
      			timestamp = lastRoute.route[lastRoute.route.length -1].t

			var line = [];

			lastRoute.route.forEach(function(e){
				var lat = e.coord[0],
					lon = e.coord[1];
				line.push([lon, lat])
			})


			line = stats.turfLine(line, {team:teamId})


			var point = turf.point([lon, lat], {team:teamId, timestamp: timestamp})

			featuresPoint.push(point)
			featuresLine.push(line)

		})


		mapData = turf.featurecollection(featuresPoint);
		mapDataLine = turf.featurecollection(featuresLine);


        linePath = g.selectAll(".line").data(mapDataLine.features)

         linePath.enter()
          .append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "#FF0000")
          .attr("stroke-width", "3px")
          .attr("stroke-opacity", 0.6)

        team = g.selectAll(".teams").data(mapData.features)

         team.enter()
          .append("path")
          .attr("class", function(d,i){return "team t_"+i;})
          .attr("fill", "#FF0000")
          .attr("fill-opacity", 0.9)
          .attr("stroke", "#FFFFFF")




  		mapTeam.on("viewreset", reset);
  		reset(true);

	      // Reposition the SVG to cover the features.
		  function reset(first) {

		  	path.pointRadius(radius);

		    var bounds = path.bounds(mapDataLine),
		        topLeft = bounds[0],
		        bottomRight = bounds[1];

		    var leafletBounds = d3.geo.bounds(mapDataLine)


		    if(first === true){
			    mapTeam.fitBounds([
				    [leafletBounds[0][1], leafletBounds[1][0]],
				    [leafletBounds[1][1], leafletBounds[0][0]]
				]);
			}

		    mapTeam.on('moveend', function(){

			    svg .attr("width", bottomRight[0] - topLeft[0] + (radius*2))
			        .attr("height", bottomRight[1] - topLeft[1] + (radius*2))
			        .style("left", (topLeft[0]-radius) + "px")
			        .style("top", (topLeft[1]-radius) + "px");

			    g.attr("transform", "translate(" + (-topLeft[0] + radius) + "," + (-topLeft[1] + radius) + ")");




			    if(first === true){
			    	linePath.attr("d", path).call(transition)
			    	team.attr("d", path);
			    	first = false;
			    }else{
			    	linePath.attr("d", path).attr("stroke-dasharray", "0,0")
			    	team.attr("d", path).attr("transform", null)
			    }
			})
		  }

		  function projectPoint(x, y) {
		    var point = mapTeam.latLngToLayerPoint(new L.LatLng(y, x));
		    this.stream.point(point.x, point.y);
		  }

        function transition(pathT) {
            pathT.transition()
                .duration(2000)
                .attrTween("stroke-dasharray", tweenDash)
        } //end transition

        function tweenDash(d,i) {

			  var l = this.getTotalLength(),
			      it = d3.interpolateString("0," + l, l + "," + l),
			      _this = this;

			  var point = d3.select(".t_"+i);

			  var originalPosition = point.attr('d').split('m')[0].replace("M","").split(",");

			  var origignalX= +originalPosition[0],
				origignalY= +originalPosition[1]

			  return function(t) {
			   	var p = _this.getPointAtLength(t * l);
				point.attr("transform", "translate(" + (p.x - origignalX)+ "," + (p.y - origignalY) + ")");//move marker

			  	return it(t);
			  };
        } //end tweenDash

		var allLast = function(data){

			var featuresPoint = [],
				featuresLine = [];

			data[0].values.forEach(function(d){

				var lastRoute = d.values[d.values.length -1],
					teamId = lastRoute['tId'],
					lat = lastRoute.route[lastRoute.route.length -1].coord[0],
	      			lon = lastRoute.route[lastRoute.route.length -1].coord[1],
	      			timestamp = lastRoute.route[lastRoute.route.length -1].t

				var line = [];

				lastRoute.route.forEach(function(e){
					var lat = e.coord[0],
						lon = e.coord[1];
					line.push([lon, lat])
				})


				line = stats.turfLine(line, {team:teamId})


				var point = turf.point([lon, lat], {team:teamId, timestamp: timestamp})

				featuresPoint.push(point)
				featuresLine.push(line)

			})

			return {points: turf.featurecollection(featuresPoint), lines: turf.featurecollection(featuresLine)}
		}

		var allTeam = function(data, selectedTeam){

			var featuresPoint = [],
				featuresLine = [];

			var teamData = data[0].values.filter(function(d){return d.key == selectedTeam});
			if (teamData.length) {
				teamData[0].values.forEach(function(d){

					var teamId = d.teamid,
						lat = d.route[d.route.length -1].coord[0],
		      			lon = d.route[d.route.length -1].coord[1],
		      			timestamp = d.route[d.route.length -1].t;

					var line = [];

					d.route.forEach(function(e){
						var lat = e.coord[0],
							lon = e.coord[1];
						line.push([lon, lat])
					})


					line = stats.turfLine(line, {team:teamId})


					var point = turf.point([lon, lat], {team:teamId, timestamp: timestamp})

					featuresPoint.push(point)
					featuresLine.push(line)

				})

				return {points: turf.featurecollection(featuresPoint), lines: turf.featurecollection(featuresLine)}

			}else{
				return {points: turf.featurecollection([]), lines: turf.featurecollection([])}
			}
		}

		 var upadate = function(){


			data = scope.routes.filter(function(d){return d.key == scope.selectedTab});

			if(scope.selectedTeam){
				mapData = allTeam(data, scope.selectedTeam).points;
				mapDataLine = allTeam(data, scope.selectedTeam).lines;

			}else{
				mapData = allLast(data).points;
				mapDataLine = allLast(data).lines;
			}

	        team.remove();
	        linePath.remove()

	        if(!mapDataLine.features.length){
	        	return
	        }

	        linePath = g.selectAll(".line").data(mapDataLine.features)

	         linePath.enter()
	          .append("path")
	          .attr("class", "line")
	          .attr("fill", "none")
	          .attr("stroke", "#FF0000")
	          .attr("stroke-width", "3px")
	          .attr("stroke-opacity", 0.6)

	       	team = g.selectAll(".teams").data(mapData.features)

	         team.enter()
	          .append("path")
          	  .attr("class", function(d,i){return "team t_"+i;})
	          .attr("fill", "#FF0000")
	          .attr("fill-opacity", 0.9)
	          .attr("stroke", "#FFFFFF")
	          .attr("stroke-opacity", 0.9)


	        reset(true);

		 }

		scope.$watch('dataLength', function(newValue, oldValue){
          if(newValue != oldValue){
              upadate()
          }
        })

		// scope.$watch('dataIDs', function(newValue, oldValue){
  //         if(newValue != oldValue){
  //              upadate()
  //         }
  //       })

		scope.$watch('selectedIndex', function(newValue, oldValue){
          if(newValue != oldValue){
              scope.selectedTab = scope.routes[newValue].key;
              scope.totalTeams = scope.routes[newValue].values.length;

              upadate()
          }
        }, true)

		scope.$watch('selectedTeam', function(newValue, oldValue){
          if(newValue != oldValue){

          	if(newValue){


          		var st = scope.routes[scope.selectedIndex].values
          									.filter(function(d){
          										return d.key == newValue;
          									})

          		scope.selectedTeamRoutes = st[0].values.length;
          		}

            upadate()
          }
        }, true)

      }
    };
  }]);
