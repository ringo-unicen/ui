'use strict';

angular.module('uiApp')
.factory('LastUpdatesFilterBuilder',  [ function () {
	
	// interval: second / minute / hour / month ...
	return function(range, interval) {
		var timestamp = moment().subtract(1, range+'s').startOf(interval).toISOString();
		
		this.build = function() {
			var filter = 
			{
				"range": {
					"timestamp" : {
						"gte": timestamp,
						"lte": "now"					
					}
				} 
			};
			
			timestamp = moment().subtract(3, interval+'s').startOf(interval).toISOString();
			return filter;
		}
	}
	
}])
.service('LastUpdatesFilter', ['LastUpdatesFilterBuilder', function(LastUpdatesFilterBuilder) {
	this.create = function(range, interval) {
		return new LastUpdatesFilterBuilder(range, interval).build;
	}
}])