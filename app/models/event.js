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
		
		function createEvent(_eventInfo, _callback) {
			var cloud = this.config.Cloud;
			var TAP = Ti.App.Properties;

			var deferred = Q.defer();

			// bad data so return to caller
			if (!_eventInfo) {
				_callback && _callback({
					success : false,
					model : null
				});
			} else {
				cloud.Events.create(_eventInfo, function(e) {
					if (e.success) {
						var event = e.events[0];
						TAP.setString("event", JSON.stringify(event));
						// callback with newly created event
						var newModel = new model(event);
						_callback && _callback({
							success : true,
							model : newModel
						});

						deferred.resolve(newModel);
					} else {
						Ti.API.error(e);
						_callback && _callback({
							success : false,
							model : null,
							error : e
						});

						deferred.reject(e);
					}
				});

			}
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