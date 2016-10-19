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
            style: 'mapbox://styles/mapbox/light-v9',
            center: [4.9000,52.3667],
            minZoom:12,
            maxZoom:17,
            zoom: 13
        });


        map.addControl(new mapboxgl.Navigation());

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
                  "line-color": "rgba(0,0,0,0.5)",
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
                  "line-color": "rgba(0,0,255,1)",
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

          map.on('click', function (e) {
              var visibility = map.getLayoutProperty('routes', 'visibility');

              if (visibility != 'visible') {
                  scope.removeSingleRoute();
                  if(!scope.$$phase) {
                    scope.$apply()
                  }
              }

              var features = map.queryRenderedFeatures(e.point, { layers: ['routes-hover'] });

              if (!features.length) {
                  return;
              }

              var feature = features[0];

              scope.getSingleRoute(feature.properties.teamid, feature.properties.id);

              var container = $('.routesContainer'),
                  scrollTo = $('#'+feature.properties.id);

              container.animate({
                  scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
              });

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

      var updateSingle = function(data){
        map.setLayoutProperty('routes', 'visibility', 'none');
        map.setLayoutProperty('routes-hover', 'visibility', 'none');
        if(map.getSource('emotion')){
          map.setLayoutProperty('emotion', 'visibility', 'none');
          map.setLayoutProperty('emotion-bg', 'visibility', 'none');
        }

        var startPoint = data.features[0].geometry.coordinates[0],
            endPoint = data.features[data.features.length-1].geometry.coordinates[data.features[data.features.length-1].geometry.coordinates.length-1];

        var startEnd = turf.featureCollection([
          turf.point(startPoint, {label:'start'}),
          turf.point(endPoint, {label:'end'})
        ])

        var singleRouteSource = map.getSource('singleroute');

        if(!singleRouteSource){
          map.addSource("singleroute", {
              "type": "geojson",
              "data": data
          })

          map.addSource("startend", {
              "type": "geojson",
              "data": startEnd
          })

          map.addLayer({
              "id": "singleroute",
              "type": "line",
              "source": "singleroute",
              "layout": {
                  "line-join": "round",
                  "line-cap": "round"
              },
              "paint": {
                  "line-color":{
                      property: 'emotion',
                      type: 'categorical',
                      stops: [
                          ['1', '#d7191c'],
                          ['2', '#fdae61'],
                          ['3', '#ffffbf'],
                          ['4', '#a6d96a'],
                          ['5', '#1a9641']]
                  },
                  "line-width": 3
              }
          });

          map.addLayer({
              "id": "startend",
              "type": "symbol",
              "source": "startend",
              "layout": {
                  "text-field": "{label}",
                  "text-transform": "uppercase",
                  "text-size": 12,
                  "text-offset": [0,1],
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold']
              }
          });


          var bbox = turf.bbox(data);

          map.fitBounds([[
                bbox[0],
                bbox[1]
            ], [
                bbox[2],
                bbox[3]
            ]],{padding:100});

        }else {
          map.setLayoutProperty('singleroute', 'visibility', 'visible');
          map.setLayoutProperty('startend', 'visibility', 'visible');
          map.getSource('startend').setData(startEnd)
          singleRouteSource.setData(data);
          var bbox = turf.bbox(data);

          map.fitBounds([[
                bbox[0],
                bbox[1]
            ], [
                bbox[2],
                bbox[3]
            ]],{padding:100});
        }

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

      scope.$watch('mapCenter', function(newValue, oldValue){
            if(newValue != oldValue && newValue){
              var emotion = map.getSource('emotion')
              if(!emotion){
                map.addSource("emotion", {
                    "type": "geojson",
                    "data": turf.point(newValue.center, {emotion:newValue.emotion})
                })
                map.addLayer({
                    "id": "emotion-bg",
                    "type": "circle",
                    "source": "emotion",
                    "paint": {
                        "circle-radius": 7
                    }
                });

                map.addLayer({
                    "id": "emotion",
                    "type": "circle",
                    "source": "emotion",
                    "paint": {
                        "circle-color":{
                            property: 'emotion',
                            type: 'categorical',
                            stops: [
                                ['1', '#d7191c'],
                                ['2', '#fdae61'],
                                ['3', '#ffffbf'],
                                ['4', '#a6d96a'],
                                ['5', '#1a9641']]
                        },
                        "circle-radius": 5
                    }
                });
              }else{
                map.setLayoutProperty('emotion', 'visibility', 'visible');
                map.setLayoutProperty('emotion-bg', 'visibility', 'visible');
                emotion.setData(turf.point(newValue.center, {emotion:newValue.emotion}))
              }


              map.flyTo({center: newValue.center, zoom: 17});

            }//end if change
          },true)

      scope.$watch('singleRoute.features.length', function(newValue, oldValue){
            if(newValue != oldValue && newValue){
              if(map.loaded()){
                updateSingle(scope.singleRoute);
              }else{
                map.on('load', function () {
                  updateSingle(scope.singleRoute);
                })
              }
            }else if(newValue != oldValue && !newValue){
              map.setLayoutProperty('routes', 'visibility', 'visible');
              map.setLayoutProperty('routes-hover', 'visibility', 'visible');
              map.setLayoutProperty('singleroute', 'visibility', 'none');
              map.setLayoutProperty('startend', 'visibility', 'none');
              if(map.getSource('emotion')){
                map.setLayoutProperty('emotion', 'visibility', 'none');
                map.setLayoutProperty('emotion-bg', 'visibility', 'none');
              }

            }//end if change
          })

      scope.$watchGroup(['filters.bike', 'filters.walking','filters.selectedTeam','filters.minValue','filters.maxValue'], function(newValues, oldValues, scope) {
        if(newValues[3] && newValues[4] && map.loaded()){
          scope.removeSingleRoute();
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
            // var filteredFeatures = map.querySourceFeatures('routes', {
            //     sourceLayer: 'routes',
            //     filter: [
            //       'all',
            //       methods,
            //       ['==', 'teamid', newValues[2]],
            //       ['>', 'startDatetime', newValues[3]],
            //       ['<', 'endDatetime', newValues[4]]
            //     ]
            // });
            // if(filteredFeatures.length){
            //   var fc = turf.featureCollection(filteredFeatures);
            //   var bbox = turf.bbox(fc);
            //
            //   map.fitBounds([[
            //         bbox[0],
            //         bbox[1]
            //     ], [
            //         bbox[2],
            //         bbox[3]
            //     ]],{padding:100});
            // }

          }else{
            map.setFilter('routes',[
              'all',
              methods,
              ['>', 'startDatetime', newValues[3]],
              ['<', 'endDatetime', newValues[4]]
            ]);
            // var filteredFeatures = map.querySourceFeatures('routes', {
            //     sourceLayer: 'routes',
            //     filter: [
            //       'all',
            //       methods,
            //       ['>', 'startDatetime', newValues[3]],
            //       ['<', 'endDatetime', newValues[4]]
            //     ]
            // });
            // if(filteredFeatures.length){
            //   var fc = turf.featureCollection(filteredFeatures);
            //   var bbox = turf.bbox(fc);
            //
            //   map.fitBounds([[
            //         bbox[0],
            //         bbox[1]
            //     ], [
            //         bbox[2],
            //         bbox[3]
            //     ]],{padding:100});
            // }
          }
        }

      });

      }
    };
  }]);
