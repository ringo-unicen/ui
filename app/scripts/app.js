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
.constant('endpoint', '192.168.0.104')
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
.run(function ($rootScope) {

  $rootScope.$on('$viewContentLoaded', function () {
    $.AdminLTE.layout.fix();
  });

});
