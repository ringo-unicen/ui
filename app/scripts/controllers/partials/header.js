'use strict';


angular.module('uiApp')
.controller('HeaderCtrl',  [ '$scope', '$window', function ($scope, $window) {

    $scope.logOut = function() {
      Parse.User.logOut();
      $window.location.href = '/index.html';
    }; 

}]);
