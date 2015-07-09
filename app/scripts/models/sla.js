'use strict';


angular.module('uiApp')
.factory('SlaModel',  [ '$resource', 'endpoint', function ($resource, endpoint) {

	var model = $resource('http://' + endpoint + ':3000/sla/:id', { id: '@_id' });

	return model;
}]);
