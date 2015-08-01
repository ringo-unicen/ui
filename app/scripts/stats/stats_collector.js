angular.module('uiApp')
.service('StatsCollector',  [ '$interval', '$rootScope', function ($interval, $rootScope) {

	var interval;

	this.start = function() {
		this.stop();
		interval = $interval(function() {
			// call stats builder
			$rootScope.broadcast('STATS UPDATE', {});
    	}, 1000);
	}
	
	this.stop = function() {
		if (interval) {
			$interval.cancel(interval);
			interval = null;
		}
	}
	
// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html	

}]);
