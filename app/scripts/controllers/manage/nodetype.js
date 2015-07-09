'use strict';


angular.module('uiApp')
.controller('NodeTypeCtrl',  [ '$scope', 'NodeTypeModel', function ($scope, NodeTypeModel) {

	// VARS
	$scope.nodetypes = [];

	// PUBLIC 
	$scope.add = function(){
		(new NodeTypeModel($scope.nodetype)).$save()
		.then(function(response) {
			$scope.nodetypes.push(response);
			$scope.nodetype = {};
		});
	}
	$scope.delete = function(nodetype){
		nodetype.$delete()
		.then(function(response) {
			$scope.nodetypes = _.reject($scope.nodetypes, "_id", response._id);
		});
	}	

	// INIT
	NodeTypeModel.query().$promise
	.then(function(response) {
		$scope.nodetypes	= response;
	});

}]);
