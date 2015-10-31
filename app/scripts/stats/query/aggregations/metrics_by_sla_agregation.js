'use strict';

angular.module('uiApp')
.factory('MetricsBySlaAgregation',  [ function () {
	
	return function(name, options) {
		options = options || { interval: '10s' };
		options.interval = options.interval || '10s';

		var output = 
		{
			"terms" : { "field" : "sla" },
			"aggs" : { } 
		};
		
		output.aggs[name] = {
			"date_histogram" : {
				"field" : "timestamp",
				"interval" : options.interval
			},
			"aggs" : {
				"stats" : {
					"stats" : { 
						"field" : "value" 
					} 										
				}
			} 					
		};

		return output;
	}
	
}]);