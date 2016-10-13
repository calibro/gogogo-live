'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:map
 * @description
 * # map
 */
angular.module('gogogoApp')
  .directive('map', ['$timeout', '$window', function ($timeout, $window){
    return {
      restrict: 'A',
      replace: false,
      link: function (scope, element, attrs) {

        mapboxgl.accessToken = 'pk.eyJ1IjoidGVvIiwiYSI6IllvZUo1LUkifQ.dirqtn275pAKdnqtLM2HSw';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [4.9000,52.3667],
            minZoom:12,
            maxZoom:17,
            zoom: 13
        });

        var update = function(data){
          map.addSource("routes", {
              "type": "geojson",
              "data": data
          })

          map.addLayer({
              "id": "routes",
              "type": "line",
              "source": "routes",
              "layout": {
                  "line-join": "round",
                  "line-cap": "round"
              },
              "paint": {
                  "line-color": "rgba(255,0,0,0.5)",
                  "line-width": 2
              }
          });

          map.addLayer({
              "id": "routes-hover",
              "type": "line",
              "source": "routes",
              "layout": {
                  "line-join": "round",
                  "line-cap": "round"
              },
              "paint": {
                  "line-color": "rgba(255,0,0,1)",
                  "line-width": 3
              },
              "filter": ["==", "id", ""]
          });

          map.on('mousemove', function (e) {
              var features = map.queryRenderedFeatures(e.point, { layers: ['routes'] });
              map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
              if (features.length) {
                  map.setFilter("routes-hover", ["==", "id", features[0].properties.id]);
              } else {
                  map.setFilter("routes-hover", ["==", "id", ""]);
              }
          });

          // Reset the route-hover layer's filter when the mouse leaves the map
          map.on("mouseout", function() {
              map.setFilter("routes-hover", ["==", "id", ""]);
          });

          var bbox = turf.bbox(data);

          map.fitBounds([[
                bbox[0],
                bbox[1]
            ], [
                bbox[2],
                bbox[3]
            ]],{padding:100});
        }

  		scope.$watch('routes.features.length', function(newValue, oldValue){
            if(newValue != oldValue && newValue){
              if(map.loaded()){
                update(scope.routes);
              }else{
                map.on('load', function () {
                  update(scope.routes);
                })
              }
            }//end if change
          })

          scope.$watchGroup(['filters.bike', 'filters.walking','filters.selectedTeam','slider.minValue','slider.maxValue'], function(newValues, oldValues, scope) {
            if(newValues[3] && newValues[4] && map.loaded()){
              var methods = ['in','tm'];

              if(newValues[0]){
                methods.push('bike')
              }

              if(newValues[1]){
                methods.push('walking')
              }

              if(newValues[2]){
                map.setFilter('routes',[
                  'all',
                  methods,
                  ['==', 'teamid', newValues[2]],
                  ['>', 'startDatetime', newValues[3]],
                  ['<', 'endDatetime', newValues[4]]
                ]);
              }else{
                map.setFilter('routes',[
                  'all',
                  methods,
                  ['>', 'startDatetime', newValues[3]],
                  ['<', 'endDatetime', newValues[4]]
                ]);
              }
            }

          });

      }
    };
  }]);
