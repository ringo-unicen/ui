/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/lodash/lodash.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>

'use strict';

/**
 * @ngdoc overview
 * @name uiApp
 * @description
 * # uiApp
 *
 * Main module of the application.
 */
angular
.module('uiApp', [
  'ngRoute',
  'ngSanitize',
  'ngResource'
])
.constant('endpoint', 'psaavedra.local') // 192.168.0.38 / 192.168.0.104 / psaavedra.local
.config(function ($routeProvider) {
  $routeProvider
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .when('/manage/sla', {
      templateUrl: 'views/manage/sla.html',
      controller: 'SlaCtrl'
    })    
    .when('/manage/node', {
      templateUrl: 'views/manage/node.html',
      controller: 'NodeCtrl'
    })        
    .when('/manage/nodetype', {
      templateUrl: 'views/manage/nodetype.html',
      controller: 'NodeTypeCtrl'
    })            
    .otherwise({
      redirectTo: '/dashboard'
    });
})
.run(function ($rootScope, $timeout) {

  $rootScope.$on('$viewContentLoaded', function () {
    $.AdminLTE.layout.fix();

    $timeout(function(){
      $.AdminLTE.pushMenu.activate("[data-toggle='offcanvas']");
    }, 500);    
  });

});


/// 1. doker compose up
/// 2. chequeo donde esta la ip
/// 3. conecto contra ese ES 