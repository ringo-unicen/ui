angular.module('uiApp')
.service('MetricsBySlaTransformation',  ['ColorCenvertionHelper',
function (ColorCenvertionHelper) {

	var getLabels = function(aggregations, options) { 
		return _.chain(aggregations.buckets).map(options.name + '.buckets').flatten().map(function(item){
			return moment(item.key).format("HH:mm:ss");
		}).uniq().sort().value();
	}
	var getDatasets = function(labels, aggregations, options) { 
		return _.map(aggregations.buckets, function(bucket) {
			var sla = _.find(options.slas, function(item) {
				return item._id.toLowerCase() === bucket.key.toLowerCase()
			});
			var color = ColorCenvertionHelper.hexToRgb(sla.color);
			return {
				label: sla.name,
				fillColor: 'rgba('+ color.r +','+color.g+','+color.b + ',0.2)',
				strokeColor: 'rgba('+ color.r +','+color.g+','+color.b + ',0.5)',
				data: getData(labels, bucket[options.name].buckets)
			};
		});	
	}
	var getData = function(labels, buckets) { // 'stats.avg'
		return _.map(labels, function(label) {
			var bucket = _.find(buckets, function(item) {
				return moment(item.key).format("HH:mm:ss") == label;
			});
			return bucket ? bucket.stats.avg : 0;
		});
	}

	this.transform = function(key, result, options) {
		var data = {};
		data.labels = getLabels(result.data.aggregations[key], options);
		data.datasets = getDatasets(data.labels, result.data.aggregations[key], options);
		return data;
	}

}]);

// http://www.chartjs.org/docs/#line-chart