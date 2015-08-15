'use strict';

angular.module('uiApp')
.factory('QueryBuilder', [ function() {
	
	return function() {
		var filters = [],
			aggregations = {};
		
		var buildFilters = function(){
			return _.reduce(filters, function(outout, builder) {
				return _.assign(outout, builder());	
			}, {}); 
		}
		
		var buildAggregations = function(){
			return _.mapValues(aggregations, function(builder) { 
				return builder();
			})
		}
		
		this.addFilter = function(builder) { 
			filters.push( builder );
			return this;
		}
		this.addAggregation = function(key, builder) { 
			aggregations[key] = builder;
			return this;
		}		
		
		this.build = function() { 
			var filtered = buildFilters(),
				aggs = buildAggregations(),
			query = { "query" : {} };
			
			if ( !_.isEmpty(filtered) ) {
				query["query"]["filtered"] = {
					"filter": filtered
				};
			}
			if ( !_.isEmpty(aggs) ) {
				query["aggs"] = aggregations;
			}
			
			return query;
		}
	}
	
}])
.service('QueryBuilderFactory',  [ 'QueryBuilder', function (QueryBuilder) {
	 
	 this.create = function() {
		 return new QueryBuilder();
	 }
	 
}]);

		