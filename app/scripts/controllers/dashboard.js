'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', 'SlaModel', function ($scope, SlaModel) {	
	
	$scope.slas = [];
	
	SlaModel.query().$promise
	.then(function(response) {
		$scope.slas	= response;
	});
	
}]);
	