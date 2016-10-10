'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.apiservice
 * @description
 * # apiservice
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('apiservice', function ($http, $q) {
    
    var BASE_API_URL = 'http://149.210.213.121';

    return {
     getRoutes : function(teamID){
       var deferred = $q.defer();
       var serviceUrl = '/getdataapp';

       $http({
          method: 'GET',
          cache: false,
          url : BASE_API_URL + (teamID ? serviceUrl + '/' + teamID : serviceUrl),
        }).success(function(data){
         deferred.resolve(routesFilter(data));
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     }
    };
  });
