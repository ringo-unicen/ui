angular.module('uiApp')
.service('StatsCollector',  [ '$interval', '$q', 'MetricModel', 
function ($interval, $q, MetricModel) {

	var interval, deferred;

	this.start = function(builder) {
		this.stop();
		
		deferred = $q.defer();
		
		// ADDING PROGRESS TO PROMISE
		var promise = deferred.promise;
		promise.progress = function(callback) {
			this.then(_.noop, _.noop, callback);
		};
		
		interval = $interval(function() {
			MetricModel.search(builder.build()).then(deferred.notify);
    	}, 10000);
		
		return promise;
	}
	
	this.stop = function() {
		if (interval) {
			$interval.cancel(interval);
			interval = null;
		}
		if (deferred) {	
			deferred.resolve();
			deferred = null;			
		}
	}
	
// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html	

}]);
