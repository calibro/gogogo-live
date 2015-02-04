'use strict';

/**
 * @ngdoc directive
 * @name gogogoApp.directive:resolveLoader
 * @description
 * # resolveLoader
 */
angular.module('gogogoApp')
  .directive('resolveLoader', function($rootScope, $timeout) {

  return {
    restrict: 'E',
    replace: true,
    template: '<div layout="column" layout-align="center center"class="loader ng-hide"><md-progress-circular class="md-warn" md-mode="indeterminate"></md-progress-circular><h3>loading...almost ready to GO!</h3></div>',
    link: function(scope, element) {

      $rootScope.$on('$routeChangeStart', function(event, currentRoute, previousRoute) {
        if (previousRoute) return;

        $timeout(function() {
          element.removeClass('ng-hide');
        });
      });

      $rootScope.$on('$routeChangeSuccess', function() {
        element.addClass('ng-hide');
      });
    }
  };
});