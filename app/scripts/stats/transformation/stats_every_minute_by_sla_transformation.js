angular.module('uiApp')
.service('StatsEveryMinuteBySlaTransformation',  [ 'SlaModel', 'ColorCenvertionHelper',
function (SlaModel, ColorCenvertionHelper) {

	var getLabels = function(aggregations) { 
		return _.chain(aggregations.buckets).map('minute.buckets').flatten().map('key').uniq().sort().value();
	}
	var getDatasets = function(labels, aggregations, options) { 
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
				data: getData(labels, bucket.minute.buckets)
			};
		});	
	}
	var getData = function(labels, buckets) { // 'stats.avg'
		return _.map(labels, function(label) {
			var bucket = _.find(buckets, {key: label});
			return bucket ? bucket.stats.avg : 0;
		});
	}

	this.transform = function(key, result, options) {
		var data = {};
		data.labels = getLabels(result.data.aggregations[key]);
		data.datasets = getDatasets(data.labels, result.data.aggregations[key], options);
		return data;
	}

}]);

// http://www.chartjs.org/docs/#line-chart