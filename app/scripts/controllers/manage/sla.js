'use strict';


angular.module('uiApp')
.controller('SlaCtrl',  [ '$scope', 'SlaModel', function ($scope, SlaModel) {

	// VARS
	$scope.slas = [];

	// PUBLIC 
	$scope.add = function(){
		$scope.sla.color = $('.my-colorpicker input')[0].value; //ngModel do not works

		(new SlaModel($scope.sla)).$save()
		.then(function(response) {
			$scope.slas.push(response);
			$scope.sla = {};
		});
	}
	$scope.delete = function(sla){
		sla.$delete()
		.then(function(response) {
			$scope.slas = _.reject($scope.slas, {'_id': response._id});
		});
	}	

	// INIT
	SlaModel.query().$promise
	.then(function(response) {
		$scope.slas	= response;
	});

	$(".my-colorpicker").colorpicker();
}]);
