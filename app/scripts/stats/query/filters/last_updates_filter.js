'use strict';

angular.module('uiApp')
.factory('LastUpdatesFilterBuilder',  [ function () {
	
	return function(begins) {
		var timestamp = begins || "now-1d";
		
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
			
			timestamp = moment().subtract(1, 'minutes').seconds(0).toISOString();
	
			return filter;
		}
	}
	
}])
.service('LastUpdatesFilter', ['LastUpdatesFilterBuilder', function(LastUpdatesFilterBuilder) {
	this.create = function(begins) {
		return new LastUpdatesFilterBuilder(begins).build;
	}
}])