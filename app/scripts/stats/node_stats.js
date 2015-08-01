angular.module('uiApp')
.service('NodeStats',  [ 'NodeModel', function (NodeModel) {

	this.countBySla = function(){
		return NodeModel.search({
		  "query" : {
		    "filtered" : {
		      "query" : { "match_all" : {}}
		    }
		  },
		  "aggs" : {
		    "slas" : {
		      "terms" : {
		        "field" : "sla"
		      }      
		    }
		  }
		});
	}
}]);
