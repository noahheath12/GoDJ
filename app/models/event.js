exports.definition = {

    config : {
        "columns" : {},
        "defaults" : {},
        "adapter" : {
            "type" : "acs",
        },
        "settings" : {
            "object_name" : "events",
            "object_method" : "Events"
        }
    },

	extendModel : function(Model) {
		var Q = require('q');
		
		function createEvent(_eventInfo) {
			var cloud = this.config.Cloud;
			var TAP = Ti.App.Properties;

			var deferred = Q.defer();

			cloud.Events.create(_eventInfo, function(e) {
					if (e.success) {
						var event = e.events[0];
						var newModel = new model(event);
						deferred.resolve(newModel);
					} else {
						deferred.reject(e);
					}
				});
			return deferred.promise;
		}
		_.extend(Model.prototype, {
			createEvent: createEvent
		});
		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {});
		return Collection;
	}
};