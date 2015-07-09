'use strict';


angular.module('uiApp')
.controller('NodeCtrl',  [ '$scope', 'SlaModel', 'NodeTypeModel', 'NodeModel', function ($scope, SlaModel, NodeTypeModel, NodeModel) {

	// VARS
	$scope.slas = [];
	$scope.nodetypes = [];
	$scope.nodes = [];

	// PUBLIC 
	$scope.add = function(){

		(new NodeModel($scope.node)).$save()
		.then(function(response) {
			response.sla = _.find($scope.slas, {'_id': response.sla});
			response.nodeType = _.find($scope.nodetypes, {'_id': response.nodeType});
			$scope.nodes.push(response);
			$scope.node = {};
		});
	}
	$scope.delete = function(node){
		node.$delete()
		.then(function(response) {
			$scope.nodes = _.reject($scope.nodes, '_id', response._id);
		});
	}	

	// INIT
	NodeModel.query().$promise
	.then(function(response) {
		$scope.nodes = response;

		// QUERY SLAS
		SlaModel.query().$promise
		.then(function(response) {
			$scope.slas	= response;

			$scope.nodes = _.map($scope.nodes, function(node) {
				node.sla = _.find($scope.slas, {'_id': node.sla});
				return node;
			})
		});

		// QUERY NODE TYPES
		NodeTypeModel.query().$promise
		.then(function(response) {
			$scope.nodetypes = response;

			$scope.nodes = _.map($scope.nodes, function(node) {
				node.nodeType = _.find($scope.nodetypes, {'_id': node.nodeType});
				return node;
			});
		});

	});

}]);
