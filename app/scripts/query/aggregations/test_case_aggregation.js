'use strict';

angular.module('uiApp')
.factory('TestCaseAgregation',  [ function () {
	
	return function() {
		var output = 
		{
			"terms" : {
				"field" : "sla"
			}      
		};

		return output;
	}
	
}]);