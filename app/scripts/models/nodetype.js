'use strict';


angular.module('uiApp')
.factory('NodeTypeModel',  [ '$resource', 'endpoint', function ($resource, endpoint) {

	var model = $resource('http://' + endpoint + ':3000/nodeType/:id', { id: '@_id' });

	return model;
}]);
