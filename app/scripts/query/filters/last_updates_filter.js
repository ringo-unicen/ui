'use strict';

angular.module('uiApp')
.factory('LastUpdatesFilter',  [ function () {
	
	var timestamp = "now-1y";
	
	return function() {
		var filter = 
		{
			"range": {
				"timestamp" : {
                    "gte": timestamp,
					"lte": "now"					
				}
			} 
		};
		
		timestamp = (new Date()).toISOString();

		return filter;
	}
	
}]);