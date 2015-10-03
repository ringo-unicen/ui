'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', '$q', 'SlaModel', 'NodeModel', 'StatsCollector', 'QueryBuilderFactory', 'LastUpdatesFilter', 'StatsEveryMinuteBySlaAgregation', 'StatsEveryMinuteBySlaTransformation', 
function ($scope, $q, SlaModel, NodeModel, StatsCollector, QueryBuilderFactory, LastUpdatesFilter, StatsEveryMinuteBySlaAgregation, StatsEveryMinuteBySlaTransformation) {	
	
	$scope.slas = [];
	
	var myChart, myData, myCtx,
		nodes = [],
		pieChart, pieData, pieCtx;
	
	$q.all([SlaModel.query().$promise, NodeModel.query().$promise])
	.then(function(response) {
		$scope.slas	= response[0];
		nodes = response[1];
		init();
	});
	
	var init = function() {
		// PIE CHART
		pieCtx = document.getElementById("pieChart").getContext("2d");
		pieData = _.map($scope.slas, function(sla) { 
			return {
				value: _.where(nodes, {'sla': sla._id}).length,
				color: sla.color,
				highlight: sla.color,
				label: sla.name
			}
		});
		pieChart = new Chart(pieCtx).Doughnut(pieData, {
          //Boolean - Whether we should show a stroke on each segment
          segmentShowStroke: true,
          //String - The colour of each segment stroke
          segmentStrokeColor: "#fff",
          //Number - The width of each segment stroke
          segmentStrokeWidth: 2,
          //Number - The percentage of the chart that we cut out of the middle
          percentageInnerCutout: 50, // This is 0 for Pie charts
          //Number - Amount of animation steps
          animationSteps: 100,
          //String - Animation easing effect
          animationEasing: "easeOutBounce",
          //Boolean - Whether we animate the rotation of the Doughnut
          animateRotate: true,
          //Boolean - Whether we animate scaling the Doughnut from the centre
          animateScale: false,
          //Boolean - whether to make the chart responsive to window resizing
          responsive: true,
          // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
          maintainAspectRatio: false,
          //String - A legend template
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        });
			
		
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
				myChart = new Chart(myCtx).Line(myData, {
					//Boolean - If we should show the scale at all
					showScale: true,
					//Boolean - Whether grid lines are shown across the chart
					scaleShowGridLines: false,
					//String - Colour of the grid lines
					scaleGridLineColor: "rgba(0,0,0,.05)",
					//Number - Width of the grid lines
					scaleGridLineWidth: 1,
					//Boolean - Whether to show horizontal lines (except X axis)
					scaleShowHorizontalLines: true,
					//Boolean - Whether to show vertical lines (except Y axis)
					scaleShowVerticalLines: true,
					//Boolean - Whether the line is curved between points
					bezierCurve: true,
					//Number - Tension of the bezier curve between points
					bezierCurveTension: 0.3,
					//Boolean - Whether to show a dot for each point
					pointDot: false,
					//Number - Radius of each point dot in pixels
					pointDotRadius: 4,
					//Number - Pixel width of point dot stroke
					pointDotStrokeWidth: 1,
					//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
					pointHitDetectionRadius: 20,
					//Boolean - Whether to show a stroke for datasets
					datasetStroke: true,
					//Number - Pixel width of dataset stroke
					datasetStrokeWidth: 2,
					//Boolean - Whether to fill the dataset with a color
					datasetFill: true,
					//String - A legend template
					legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
					//Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
					maintainAspectRatio: false,
					//Boolean - whether to make the chart responsive to window resizing
					responsive: true					
				});
			} else {
				
				myData.labels.forEach(function(label, index) {
					var add = false;
					var values = _.map(myChart.datasets, function(dataset) {
						var value,
						point = _.find(dataset.points, 'label', label),
						values = _.find(myData.datasets, 'label', dataset.label);
						
						if ( point ) {
							point.value[0] = values && (values.data[index] > 0) ? values.data[index] : point.value[0];
							myChart.update();
						} else {
							add = true;
							value = values ? values.data[index] : 0; 	 
						}
						
						return [value];
					});
					if (add) { 
						if (myChart.datasets[0].points.length > 60) { 
							myChart.removeData( );							
						}
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