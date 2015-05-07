exports.definition = {

    config : {
        "adapter" : {
            "type" : "acs",
            "collection_name" : "reviews"
        },
        "settings" : {
			"object_name" : "reviews",
			"object_method" : "Reviews"
		}
    },

    extendModel : function(Model) {
    	var Q = require('q');
    	
    	function createReview(_reviewInfo) {
			var cloud = this.config.Cloud;
			var TAP = Ti.App.Properties;

			var deferred = Q.defer();

			cloud.Reviews.create(_reviewInfo, function(e) {
					if (e.success) {
						var review = e.reviews[0];
						var newModel = new model(review);
						deferred.resolve(newModel);
						alert("review created");
					} else {
						deferred.reject(e);
					}
				});
			return deferred.promise;
		}
    	
    	
        _.extend(Model.prototype, {
        	createReview : createReview
        });
        return Model;
    },

    extendCollection : function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    },
};
