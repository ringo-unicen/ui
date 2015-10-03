/// <reference path="../../../typings/lodash/lodash.d.ts"/>
'use strict';

angular.module('uiApp')
.directive('rngFakeMetrics', ['$interval', '$q', 'MetricModel', 'SlaModel', 'NodeModel', function($interval, $q, MetricModel, SlaModel, NodeModel) {
	return {
		restrict: 'E',
		template: '<div class="fake-metrics"><label><input type="checkbox" ng-model="enable" ng-change="toggle()"> Fake Metrics</label></div>',
		link: function(scope, element, attrs) {
		    var intervalID,
				slas = [],
				nodes = [];
			
			scope.enable = !!attrs.enable || false;
			scope.toggle = function(){
				if (scope.enable) {
					intervalID = $interval(function() {
						var sla = _.sample(slas),
							node = _.chain(nodes).filter({sla: sla._id}).sample().value();
			      		
						if (sla && node) {
							MetricModel.post(sla, node, 'fake', _.random(100, false));
						}
			    	}, 10000);
				} else {
					$interval.cancel(intervalID);
				}
			}
			
			// INIT 
			$q.all([ SlaModel.query().$promise, NodeModel.query().$promise])
			.then(function(responses){
				slas = responses[0];
				nodes = responses[1];
				scope.toggle();
			});			

			// ON END
		    element.on('$destroy', function() {
				if (scope.enable) {
					$interval.cancel(intervalID);		
				}	
		    });
		}	
	}	
}])
