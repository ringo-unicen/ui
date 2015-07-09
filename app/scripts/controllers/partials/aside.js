'use strict';


angular.module('uiApp')
.controller('AsideCtrl',  [ '$scope', '$location', function ($scope, $location) {

	$scope.nav = function(path){
		$location.path(path);
	}

	$scope.isActive = function(path){
		return _.startsWith($location.path(), path);
	}

    $.AdminLTE.tree('.sidebar');

}]);
