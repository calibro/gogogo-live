'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:mapall
 * @description
 * # mapall
 */
angular.module('gogogoApp')
    .directive('mapall', ['$timeout', '$window', '$filter',function ($timeout, $window, $filter){
      return {
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs) {

          mapboxgl.accessToken = 'pk.eyJ1IjoidGVvIiwiYSI6IllvZUo1LUkifQ.dirqtn275pAKdnqtLM2HSw';
          var map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mapbox/light-v9',
              center: [4.9000,52.3667],
              minZoom:8,
              maxZoom:17,
              zoom: 13
          });

          var emotionMarker;

          map.addControl(new mapboxgl.NavigationControl());

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
                    "line-color":{
                        property: 'emotion',
                        type: 'categorical',
                        stops: [
                            ['1', 'rgba(215, 25, 28,0.25)'],
                            ['2', 'rgba(253, 174, 97,0.25)'],
                            ['3', 'rgba(255, 255, 191,0.25)'],
                            ['4', 'rgba(166, 217, 106,0.25)'],
                            ['5', 'rgba(26, 150, 65,0.25)']]
                    },
                    "line-width": 3
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
                    "line-color": "rgba(255,255,255,1)",
                    "line-width": 1,
                    "line-gap-width":4
                },
                "filter": ["==", "chunkid", ""]
            });

            map.addLayer({
                "id": "routes-hover-in",
                "type": "line",
                "source": "routes",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                  "line-color":{
                      property: 'emotion',
                      type: 'categorical',
                      stops: [
                          ['1', 'rgba(215, 25, 28,1)'],
                          ['2', 'rgba(253, 174, 97,1)'],
                          ['3', 'rgba(255, 255, 191,1)'],
                          ['4', 'rgba(166, 217, 106,1)'],
                          ['5', 'rgba(26, 150, 65,1)']]
                  },
                  "line-width": 4
                },
                "filter": ["==", "chunkid", ""]
            });

            map.on('mousemove', function (e) {
              if(map.getSource('routes')){
                var features = map.queryRenderedFeatures(e.point, { layers: ['routes'] });
                map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
              }
            });

            map.on('click', function (e) {
              var features = map.queryRenderedFeatures(e.point, { layers: ['routes'] });

              if (features.length) {
                  map.setFilter("routes-hover-in", ["==", "chunkid", features[0].properties.chunkid]);
                  map.setFilter("routes-hover", ["==", "chunkid", features[0].properties.chunkid]);
              } else {
                  map.setFilter("routes-hover-in", ["==", "chunkid", ""]);
                  map.setFilter("routes-hover", ["==", "chunkid", ""]);
                  return;
              }

              var feature = features[0];
              var color;
              switch (feature.properties.emotion) {
                  case '1':
                      color = "#d7191c";
                      break;
                  case '2':
                      color = "#fdae61";
                      break;
                  case '3':
                      color = "#c7c732";
                      break;
                  case '4':
                      color = "#a6d96a";
                      break;
                  case '5':
                      color = "#1a9641";
              }

              var distance = Math.round(turf.lineDistance(feature)*100)/100;
              var date = $filter('date')(feature.properties.startDatetime, "MMM d, y") + ' at ' + $filter('date')(feature.properties.startDatetime, "HH:mm:ss");
              var text = '<span class="popupTitle">' +
                          feature.properties.teamid +
                          '</span><br><span class="popupSubTitle">' +
                          '<span style="color:' + color +';">' + distance + ' km </span>' +
                          'by ' +
                          feature.properties.tm +'<br>on '+
                           date +'</span>';


              var popup = new mapboxgl.Popup()
                  .setLngLat(map.unproject(e.point))
                  .setHTML(text)
                  .addTo(map);
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

        // scope.$watch('mapCenter', function(newValue, oldValue){
        //       if(newValue != oldValue && newValue){
        //
        //         if(emotionMarker){
        //           emotionMarker.remove();
        //         }
        //         var el = d3.select('body').append('div');
        //
        //         el.append('i')
        //           .attr("class", function(){
        //             var icon;
        //             switch (newValue.emotion) {
        //                 case '1':
        //                     icon = "em-tired_face";
        //                     break;
        //                 case '2':
        //                     icon = "em-worried";
        //                     break;
        //                 case '3':
        //                     icon = "em-neutral_face";
        //                     break;
        //                 case '4':
        //                     icon = "em-blush";
        //                     break;
        //                 case '5':
        //                     icon = "em-smile";
        //             }
        //             return 'em ' + icon;
        //           })
        //
        //
        //         emotionMarker = new mapboxgl.Marker(el.node(),{'offset':[-9,-9]})
        //         	.setLngLat(newValue.center)
        //           .addTo(map);
        //
        //         map.flyTo({center: newValue.center, zoom: 17});
        //
        //       }//end if change
        //     },true)

        // scope.$watch('singleRoute.features.length', function(newValue, oldValue){
        //       if(newValue != oldValue && newValue){
        //         if(map.loaded()){
        //           updateSingle(scope.singleRoute);
        //         }else{
        //           map.on('load', function () {
        //             updateSingle(scope.singleRoute);
        //           })
        //         }
        //       }else if(newValue != oldValue && !newValue){
        //
        //         if(!scope.filters.selectedTeam){
        //           map.setLayoutProperty('routes', 'visibility', 'visible');
        //           map.setLayoutProperty('routes-hover', 'visibility', 'visible');
        //           map.setLayoutProperty('routes-hover-in', 'visibility', 'visible');
        //         }else if(map.getSource('singleteam')){
        //           map.setLayoutProperty('singleteam', 'visibility', 'visible');
        //         }
        //
        //         map.setLayoutProperty('singleroute', 'visibility', 'none');
        //         map.setLayoutProperty('startend', 'visibility', 'none');
        //         if(emotionMarker){
        //           emotionMarker.remove();
        //         }
        //
        //       }//end if change
        //     })

          // scope.$watch('singleTeam.features.length', function(newValue, oldValue){
          //       if(newValue != oldValue && newValue){
          //         //if(map.loaded()){
          //           //updateTeam(scope.singleTeam);
          //         //}else{
          //           //map.on('load', function () {
          //           console.log("ciao")
          //             updateTeam(scope.singleTeam);
          //           //})
          //         //}
          //       }else if(newValue != oldValue && !newValue){
          //         map.setLayoutProperty('routes', 'visibility', 'visible');
          //         map.setLayoutProperty('routes-hover', 'visibility', 'visible');
          //         map.setLayoutProperty('routes-hover-in', 'visibility', 'visible');
          //         map.setLayoutProperty('singleteam', 'visibility', 'none');
          //         // map.setLayoutProperty('startend', 'visibility', 'none');
          //         // if(map.getSource('emotion')){
          //         //   map.setLayoutProperty('emotion', 'visibility', 'none');
          //         //   map.setLayoutProperty('emotion-bg', 'visibility', 'none');
          //         // }
          //
          //       }//end if change
          //     })

        // scope.$watchGroup(['filters.bike', 'filters.walking','filters.selectedTeam','filters.minValue','filters.maxValue'], function(newValues, oldValues, scope) {
        //
        //   if(newValues[3] && newValues[4] && map.getSource('routes')){
        //     scope.removeSingleRoute();
        //     var methods = ['in','tm'];
        //
        //     if(newValues[0]){
        //       methods.push('bike')
        //     }
        //
        //     if(newValues[1]){
        //       methods.push('walking')
        //     }
        //
        //     if(newValues[2]){
        //       // map.setLayoutProperty('routes', 'visibility', 'visible');
        //       // map.setLayoutProperty('routes-hover', 'visibility', 'visible');
        //       // map.setLayoutProperty('routes-hover-in', 'visibility', 'visible');
        //       map.setFilter('routes',[
        //         'all',
        //         methods,
        //         ['==', 'teamid', newValues[2]],
        //         ['>', 'startDatetime', newValues[3]],
        //         ['<', 'endDatetime', newValues[4]]
        //       ]);
        //
        //       if(map.getSource('singleteam')){
        //         map.setFilter('singleteam',[
        //           'all',
        //           methods,
        //           ['==', 'teamid', newValues[2]],
        //           ['>', 'startDatetime', newValues[3]],
        //           ['<', 'endDatetime', newValues[4]]
        //         ]);
        //       }
        //
        //     }else{
        //       map.setLayoutProperty('routes', 'visibility', 'visible');
        //       map.setLayoutProperty('routes-hover', 'visibility', 'visible');
        //       map.setLayoutProperty('routes-hover-in', 'visibility', 'visible');
        //       map.setFilter('routes',[
        //         'all',
        //         methods,
        //         ['>', 'startDatetime', newValues[3]],
        //         ['<', 'endDatetime', newValues[4]]
        //       ]);
        //     }//end if team
        //   }//end if change
        //
        // });

        }
      };
    }]);
