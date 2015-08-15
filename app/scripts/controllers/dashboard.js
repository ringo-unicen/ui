'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', 'SlaModel', 'NodeStats', 'StatsCollector', 'QueryBuilderFactory', 'LastUpdatesFilter', 
function ($scope, SlaModel, NodeStats, StatsCollector, QueryBuilderFactory, LastUpdatesFilter) {	
	
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
	
	// STATS / ON
	var queryBuilder = QueryBuilderFactory.create()
	.addFilter(LastUpdatesFilter);
		
	// STATS / UPDATE
	StatsCollector.start(queryBuilder)
	.progress(function(response) {
		console.log("new stats arrieved. hits: " + response.data.hits.total);
	});
	
	// STATS / OFF
	$scope.$on('$destroy', function() {
		StatsCollector.stop();
	});
	
}]);