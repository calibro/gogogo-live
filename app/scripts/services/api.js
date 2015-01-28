'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.api
 * @description
 * # api
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('api', function ($http, $q) {

    var BASE_API_URL = 'http://188.226.184.134';

    return {
     getRoutes : function(teamID){
       var deferred = $q.defer();
       var serviceUrl = '/getdataapp';

       $http({
          method: 'GET',
          url : BASE_API_URL + (teamID ? serviceUrl + '/' + teamID : serviceUrl),
        }).success(function(data){
         deferred.resolve(data);
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     }
    };
  });