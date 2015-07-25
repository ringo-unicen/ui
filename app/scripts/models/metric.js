'use strict';


angular.module('uiApp')
.factory('MetricModel',  [ '$http', 'endpoint', function ($http, endpoint) {

	var get = function(query) {
		return $http.get('http://' + endpoint + ':3000/metrics', query);
	}
	
	var post = function(sla, node, type, value) {
		return $http.post('http://' + endpoint + ':3000/metrics', { 
			sla: sla._id,
			node: node._id,
			type: type,
			value: value,
			timestamp: Date.now()
		});
	}
	
	return {
		get: get,
		post: post
	};
}]);
