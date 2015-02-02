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

    $scope.errors;
    $scope.methods;
    $scope.autoupdate = true;

    if(!routes.length){
        $scope.routes = []
        $scope.routes.push({key:"walking", values:[]})
        $scope.routes.push({key:"bike", values:[]})
        $scope.routes.push({key:"public_transport", values:[]})
        $scope.methods = ["walking", "bike", "public_transport"]
        $scope.errors = "It seems there is no data...come back later!"
        $scope.autoupdate = false;
    }else{
        $scope.routes = routes
        $scope.methods = $scope.routes.map(function(d){return d.key})
    }
    

    $scope.windowHeight = ($window.innerHeight - 48 - 79) + 'px';

    $scope.lastNofRoutes = 10;
    $scope.lastNofTeams = 10;
    $scope.search = {};

    $scope.selectedIndex = 0;
    $scope.selectedTab = $scope.routes[$scope.selectedIndex].key;
    $scope.selectedTeam;
    $scope.totalTeams = $scope.routes[$scope.selectedIndex].values.length;
    $scope.selectedTeamRoutes;




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

    if($scope.autoupdate){
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
    }

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
