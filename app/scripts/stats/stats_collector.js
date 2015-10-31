angular.module('uiApp')
.factory('StatsCollector',  [ '$interval', '$q', 
function ($interval, $q) {

	return function(builder, model, interval) { 
		var running, deferred;
	
		this.start = function() {
			this.stop();
			
			deferred = $q.defer();
			
			// ADDING PROGRESS TO PROMISE
			var promise = deferred.promise;
			promise.progress = function(callback) {
				this.then(_.noop, _.noop, callback);
			};
			
			model.search(builder.build()).then(deferred.notify);
			running = $interval(function() {
				model.search(builder.build()).then(deferred.notify);
			}, interval);
			
			return promise;
		}
		
		this.stop = function() {
			if (running) {
				$interval.cancel(running);
				running = null;
			}
			if (deferred) {	
				deferred.resolve();
				deferred = null;			
			}
		}
	}

}])
.service('StatsCollectorFactory',  [ 'StatsCollector', function (StatsCollector) {
	 
	 this.create = function(builder, model, interval) {
		 return new StatsCollector(builder, model, interval);
	 }
	 
}]);

// https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-daterange-aggregation.html	
