'use strict';

angular.module('uiApp')
.factory('StatsEveryMinuteBySlaAgregation',  [ function () {
	
	return function() {
		var output = 
		{
			"terms" : {
				"field" : "sla"
			},
			"aggs" : {
				"minute" : {
					"date_histogram" : {
						"field" : "timestamp",
						"interval" : "minute"
					},
					"aggs" : {
						"stats" : {
							"stats" : { 
								"field" : "value" 
							} 										
						}
					} 					
				}
			}			     
		};

		return output;
	}
	
}]);