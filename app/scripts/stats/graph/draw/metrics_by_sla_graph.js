angular.module('uiApp')
.factory('MetricsBySlaGraph',  [ '$interval', '$q', 'MetricsBySlaTransformation',
function ($interval, $q, MetricsBySlaTransformation) {

	return function(context, params) { 
		var data, chart, 
		options = {
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
		} 
		
		
		this.draw = function(response) {
			
			data = MetricsBySlaTransformation.transform(params.aggregator, response, {slas: params.slas, name: params.name});
			if (!chart) {
				chart = new Chart(context).Line(data, options);
			} else {
				data.labels.forEach(function(label, index) {
					var add = false;
					var values = _.map(chart.datasets, function(dataset) {
						var value,
						point = _.find(dataset.points, 'label', label),
						values = _.find(data.datasets, 'label', dataset.label);
						
						if ( point ) {
							point.value[0] = values && (values.data[index] > 0) ? values.data[index] : point.value[0];
							chart.update();
						} else {
							add = true;
							value = values ? values.data[index] : 0; 	 
						}
						
						return [value];
					});
					if (add) { 
						var older = moment(chart.datasets[0].points[0].label, "HH:mm:ss"),
							range = moment().subtract(1, params.range);
						chart.addData(values, label);	
						if (older < range) { 
							chart.removeData( );							
						}						
					}
				})
			}
		}			
	}

}]);
	
