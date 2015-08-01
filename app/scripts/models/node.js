'use strict';


angular.module('uiApp')
.factory('NodeModel',  [ '$resource', 'endpoint', function ($resource, endpoint) {

	var model = $resource('http://' + endpoint + ':3000/node/:id', 
		{ id: '@_id' },
		{'search': { method:'PUT', url: 'http://' + endpoint + ':3000/node/search' } }
	);

	return model;
}]);
