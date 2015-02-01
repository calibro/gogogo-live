'use strict';

/**
 * @ngdoc function
 * @name gogogoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gogogoApp
 */
angular.module('gogogoApp')
  .controller('HomeCtrl', function ($scope, $window, $interval, $mdToast, $animate, apiService, routes, routesFilter, routesService ) {

    $scope.routes = routes
    $scope.windowHeight = ($window.innerHeight - 48 - 79) + 'px';

    $scope.lastNofRoutes = 10;
    $scope.lastNofTeams = 10;
    $scope.search = {};

    $scope.selectedIndex = 0;
    $scope.selectedTab = $scope.routes[$scope.selectedIndex].key;
    $scope.selectedTeam;
    $scope.errors; 
    $scope.totalTeams = $scope.routes[$scope.selectedIndex].values.length;
    $scope.selectedTeamRoutes;
    $scope.autoupdate = true;




    $scope.teamSubmit = function(team){
        $scope.selectedTeam = team;
    }

    $scope.teamClear = function(){
        $scope.selectedTeam = undefined;
    }


    var timer;
    var killtimer = function(){
      if(angular.isDefined(timer))
        {
          $interval.cancel(timer);
          timer=undefined;
        }
    };

    timer = $interval(function(){
                     $scope.showSimpleToast()
                apiService.getRoutes().then(
                    function(data){
                        $scope.routes = data;
                        $scope.loading = false;
                        $scope.closeToast()
                    },
                    function(error){
                        $scope.errors = error;
                        $scope.closeToast()
                         killtimer();
                    })
            },15000);

  $scope.showSimpleToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .content('LOADING NEW DATA...')
        .position('top right')
    );
  };

     $scope.closeToast = function() {
        $mdToast.hide();
      };

    $scope.onAutoupdateChange = function(auState){

        if(auState){
            timer = $interval(function(){
                 $scope.showSimpleToast()
            apiService.getRoutes().then(
                function(data){
                    $scope.routes = data;
                    $scope.loading = false;
                    $scope.closeToast()
                },
                function(error){
                    $scope.errors = error;
                    $scope.closeToast()
                     killtimer();
                })
            },15000);

        }else{
            killtimer();
        }
    };

  });
