'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', 'SlaModel', 'NodeStats', function ($scope, SlaModel, NodeStats) {	
	
	$scope.slas = [];
	
	SlaModel.query().$promise
	.then(function(response) {
		$scope.slas	= response;
	});
	
	$scope.stats = []
	NodeStats.countBySla().$promise
	.then(function(response) {
		$scope.stats = response.aggregations.slas.buckets;
	});
	
	$scope.nodesBySla = function(sla) {
		var stat = _.find($scope.stats, {key: sla._id});
		return stat ? stat.doc_count : 0;
	}
	
}]);