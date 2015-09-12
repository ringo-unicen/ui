'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', 'SlaModel', 'StatsCollector', 'QueryBuilderFactory', 'LastUpdatesFilter', 'StatsEveryMinuteBySlaAgregation', 'StatsEveryMinuteBySlaTransformation', 
function ($scope, SlaModel, StatsCollector, QueryBuilderFactory, LastUpdatesFilter, StatsEveryMinuteBySlaAgregation, StatsEveryMinuteBySlaTransformation) {	
	
	$scope.slas = [];
	var myChart, myData, myCtx;
	
	SlaModel.query().$promise
	.then(function(response) {
		$scope.slas	= response;
		init();
	});
	
	var init = function() {
		// STATS / ON
		var queryBuilder = QueryBuilderFactory.create()
		.addFilter(LastUpdatesFilter.create('now-1h'))
		.addAggregation('stats', StatsEveryMinuteBySlaAgregation);
			
		// STATS / UPDATE
		StatsCollector.start(queryBuilder)
		.progress(function(response) {
			myData = StatsEveryMinuteBySlaTransformation.transform('stats', response, {slas: $scope.slas});
			if (!myChart) {
				myCtx = document.getElementById("myChart").getContext("2d");
				console.log("labels:");  console.log(myData.labels);
				console.log("values:");  console.log(myData.datasets);
				myChart = new Chart(myCtx).Line(myData, {});
			} else {
				// TODO: merge StatsEveryMinuteBySlaTransformation to myData 
				
				myData.labels.forEach(function(label, index) {
					var exists = false;
					var values = _.map(myChart.datasets, function(dataset) {
						var value,
						point = _.find(dataset.points, 'label', label),
						values = _.find(myData.datasets, 'label', dataset.label);
						
						if ( point ) {
							exists = true;
							point.value[0] = values && (values.data[index] > point.value[0]) ? values.data[index] : point.value[0];
						} else {
							value = values ? values.data[index] : 0; 	 
						}
						
						return [value];
					});
					if (exists) { 
						myChart.update();
					} else {
						myChart.removeData( );
						myChart.addData(values, label);	
					}
		
				})
				
			}
		});
		
		// STATS / OFF
		$scope.$on('$destroy', function() {
			StatsCollector.stop();
		});
	}

}]);