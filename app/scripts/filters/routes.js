'use strict';

/**
 * @ngdoc filter
 * @name gogogoApp.filter:routes
 * @function
 * @description
 * # routes
 * Filter in the gogogoApp.
 */
angular.module('gogogoApp')
  .filter('routes', function () {
    return function (input,filters,slider){
      if(input){

      input = input.filter(function(d){

        var bike = filters.bike?'bike':false,
            walking = filters.walking?'walking':false;

        var time = d.properties.startDatetime>=slider.minValue?(d.properties.endDatetime<=slider.maxValue?true:false):false;

        if(filters.selectedTeam){
          return (d.properties.tm == bike || d.properties.tm == walking) && d.properties.teamid == filters.selectedTeam && time
        }else{
          return d.properties.tm == bike || d.properties.tm == walking && time
        }
      })
      return input;
      }
    };
  });
