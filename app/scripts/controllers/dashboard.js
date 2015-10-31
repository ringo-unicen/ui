'use strict';


angular.module('uiApp')
.controller('DashboardCtrl',  [ '$scope', '$q', 'SlaModel', 'NodeModel', 'MetricModel', 'StatsCollectorFactory', 'QueryBuilderFactory', 'LastUpdatesFilter', 'MetricsBySlaGraph', 'MetricsBySlaAgregation',
function ($scope, $q, SlaModel, NodeModel, MetricModel, StatsCollectorFactory, QueryBuilderFactory, LastUpdatesFilter, MetricsBySlaGraph, MetricsBySlaAgregation) {	
	
	$scope.slas = [];
	
	var nodes = [],
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
			

		// RANGE & INTERVAL ????
		// STATS / INIT / QUERY
		var range = 'hour', 
			interval = 'minute';
		var queryStats = QueryBuilderFactory.create()
		.addFilter(LastUpdatesFilter.create(range, interval))
		.addAggregation('stats', {
			name: 'interval',
			options: { interval: interval }, 
			build: MetricsBySlaAgregation
		});
		// STATS / INIT / GRAPH
		var statsGraph = new MetricsBySlaGraph(
			document.getElementById("myChart").getContext("2d"),
			{
				name: 'interval',
				range: range,
				aggregator: 'stats',
				slas: $scope.slas
			}
		);
		// STATS / INIT / COLLECTOR
		var duration = moment.duration(1, interval+'s')._milliseconds;
		var graph = StatsCollectorFactory.create(queryStats, MetricModel, duration);  
			
		// STATS / ON
		graph.start().progress(statsGraph.draw);
		
		// STATS / OFF
		$scope.$on('$destroy', function() {
			graph.stop();
		});
	}

}]);