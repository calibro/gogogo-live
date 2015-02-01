'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.routesData
 * @description
 * # routesData
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('routesService', function ($interval, apiService) {

    var timer;
    var killtimer = function(){
      if(angular.isDefined(timer))
        {
          $interval.cancel(timer);
          timer=undefined;
        }
    };

    return {
      update: function (interval, id) {
        timer = $interval(function(){
                  apiService.getRoutes(id);
                },interval);
      },
      stop: function(){

        killtimer();

      }
    };
  });
