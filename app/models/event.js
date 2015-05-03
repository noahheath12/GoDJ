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
		
		function getEvents(_eventInfo){
			var cloud = this.config.Cloud;
			var deferred = Q.defer();
			
			cloud.Events.search(_eventInfo, function(e) {
					if (e.success) {
						alert('Success:\n' +
           				'Count: ' + e.events.length);
        				for (var i = 0; i < e.events.length; i++) {
           					var event = e.events[i];
           					alert('id: ' + event.id + '\n' +
                  			'name: ' + event.name + '\n' +
                  			'longitude: ' + event.longitude + '\n' +
                  			'latitude: ' + event.latitude + '\n' +
                  			'updated_at: ' + event.updated_at);
                  			var newModel = new model(event);
							deferred.resolve(newModel);
        				}
					} else {
						deferred.reject(e);
					}
			});
			
			
		}
		_.extend(Model.prototype, {
			createEvent: createEvent,
			getEvents: getEvents
		});
		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {});
		return Collection;
	}
};