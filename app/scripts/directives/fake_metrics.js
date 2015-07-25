/// <reference path="../../../typings/lodash/lodash.d.ts"/>
'use strict';

angular.module('uiApp')
.directive('rngFakeMetrics', ['$interval', '$q', 'MetricModel', 'SlaModel', 'NodeModel', function($interval, $q, MetricModel, SlaModel, NodeModel) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
		    var enable = attrs.rngFakeMetrics || false,
				intervalID,
				slas = [],
				nodes = [];
			
			function toogle(){
				if (enable) {
					intervalID = $interval(function() {
						var sla = _.sample(slas),
							node = _.chain(nodes).filter({sla: sla._id}).sample().value();
			      		
						MetricModel.post(sla, node, 'fake', _.random(100, false));
			    	}, 1000);
				} else {
					$interval.cancel(intervalID);
				}
			}
			
			// INIT 
			$q.all([ SlaModel.query().$promise, NodeModel.query().$promise])
			.then(function(responses){
				slas = responses[0];
				nodes = responses[1];
				toogle();
			});			
			
			// ON CHANGE
			scope.$watch(attrs.rngFakeMetrics, function(value) {
				enable = value;
				toogle();
		    });

			// ON END
		    element.on('$destroy', function() {
				if (enable) {
					$interval.cancel(intervalID);		
				}	
		    });
		}	
	}	
}])
