'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', 'SlaModel', 'StatsCollector', 'QueryBuilderFactory', 'LastUpdatesFilter', 'StatsEveryMinuteBySlaAgregation', 'StatsEveryMinuteBySlaTransformation', 
function ($scope, SlaModel, StatsCollector, QueryBuilderFactory, LastUpdatesFilter, StatsEveryMinuteBySlaAgregation, StatsEveryMinuteBySlaTransformation) {	
	
	$scope.slas = [];
	
	SlaModel.query().$promise
	.then(function(response) {
		$scope.slas	= response;
		init();
	});
	
	var init = function() {
		// STATS / ON
		var queryBuilder = QueryBuilderFactory.create()
		.addFilter(LastUpdatesFilter.create('now-1d'))
		.addAggregation('stats', StatsEveryMinuteBySlaAgregation);
			
		// STATS / UPDATE
		StatsCollector.start(queryBuilder)
		.progress(function(response) {
			StatsEveryMinuteBySlaTransformation.transform('stats', response, {slas: $scope.slas});
			console.log("new stats arrieved. hits: " + response.data.hits.total);
		});
		
		// STATS / OFF
		$scope.$on('$destroy', function() {
			StatsCollector.stop();
		});
	}

}]);