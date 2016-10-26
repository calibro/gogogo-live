'use strict';

/**
 * @ngdoc service
 * @name gogogoApp.apiservice
 * @description
 * # apiservice
 * Factory in the gogogoApp.
 */
angular.module('gogogoApp')
  .factory('apiservice', function ($http, $q, parseRoutesFilter, parseSingleRouteFilter,parseSingleTeamFilter) {

    var BASE_API_URL = 'http://149.210.213.121';

    return {
     getRoutes : function(teamID, routeID){
       var deferred = $q.defer();
       var serviceUrl = '/getdataapp';
       var endPointUrl = teamID ? (routeID ? serviceUrl + '/' + teamID + '/' + routeID : serviceUrl + '/' + teamID) : serviceUrl;

       $http({
          method: 'GET',
          cache: false,
          url : BASE_API_URL + endPointUrl,
        }).success(function(data){
         deferred.resolve(parseRoutesFilter(data));
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     },
     getSingleRoute : function(teamID, routeID){
       var deferred = $q.defer();
       var serviceUrl = '/getdataapp';
       var endPointUrl = serviceUrl + '/' + teamID + '/' + routeID;

       $http({
          method: 'GET',
          cache: false,
          url : BASE_API_URL + endPointUrl,
        }).success(function(data){
         deferred.resolve(parseSingleRouteFilter(data));
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     },
     getSingleTeam : function(teamID){
       var deferred = $q.defer();
       var serviceUrl = '/getdataapp';
       var endPointUrl = serviceUrl + '/' + teamID;

       $http({
          method: 'GET',
          cache: false,
          url : BASE_API_URL + endPointUrl,
        }).success(function(data){
         deferred.resolve(parseSingleTeamFilter(data));
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     },
     getRoutesAll : function(){
       var deferred = $q.defer();
       var serviceUrl = '/getfulldataapp';
       var endPointUrl = serviceUrl;

       $http({
          method: 'GET',
          cache: false,
          url : BASE_API_URL + endPointUrl,
        }).success(function(data){
         deferred.resolve(parseSingleTeamFilter(data));
       }).error(function(){
         deferred.reject('An error occured while fetching data');
       });

       return deferred.promise;
     }
    };
  });
