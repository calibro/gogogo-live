'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.fileService
 * @description
 * # fileService
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('fileService', function ($http, $q, routesFilter) {

  return {

     getFile : function(url){
       var deferred = $q.defer();
       $http.get(url).success(function(data){
         deferred.resolve(data);
       }).error(function(){
         deferred.reject("An error occured while fetching file");
       });

       return deferred.promise;
     }
   };
  });
