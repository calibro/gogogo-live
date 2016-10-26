'use strict';

/**
 * @ngdoc overview
 * @name gogogoApp
 * @description
 * # gogogoApp
 *
 * Main module of the application.
 */
angular
  .module('gogogoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angular-loading-bar',
    'angular.filter',
    'rzModule'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/explore', {
        templateUrl: 'views/explore.html',
        controller: 'ExploreCtrl',
        controllerAs: 'explore'
      })
      .when('/', {
        redirectTo: '/home'
      })
      .when('/all', {
        templateUrl: 'views/all.html',
        controller: 'AllCtrl',
        controllerAs: 'all'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
