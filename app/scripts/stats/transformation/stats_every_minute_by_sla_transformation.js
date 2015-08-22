angular.module('uiApp')
.service('StatsEveryMinuteBySlaTransformation',  [ 'SlaModel', 'ColorCenvertionHelper',
function (SlaModel, ColorCenvertionHelper) {

	var labels = function(aggregations) { 
		return _.chain(aggregations.buckets).map('minute.buckets').flatten().map('key').uniq().sort().value();
	}
	var datasets = function(aggregations, options) { 
		return _.map(aggregations.buckets, function(bucket) {
			var sla = _.find(options.slas, function(item) {
				return item._id.toLowerCase() === bucket.key
			});
			var color = ColorCenvertionHelper.hexToRgb(sla.color);
			return {
				label: sla.name,
				fillColor: 'rgba('+ color.r +','+color.g+','+color.b + ',0.2)',
				strokeColor: color,
				pointColor: color,
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: color,				
				data: []
			};
		});
	}
	// var dataset_data = function(sla, options) {
		
	// }

	this.transform = function(key, result, options) {
		var data = {};
		data.labels = labels(result.data.aggregations[key]);
		data.datasets = datasets(result.data.aggregations[key], options);
		return data;
	}

}]);

// http://www.chartjs.org/docs/#line-chart