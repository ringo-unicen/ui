'use strict';

angular.module('uiApp')
.controller('HeaderCtrl',  [ '$scope', '$location', function ($scope, $location) {

    $scope.logOut = function() {
       $location.path('/dashboard');
    }; 

}]);
