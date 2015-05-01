exports.definition = {

    config : {
        "columns" : {},
        "defaults" : {},
        "adapter" : {
            "type" : "acs",
        },
        "settings" : {
            "object_name" : "photos",
            "object_method" : "Photos"
        }
    },

	extendModel : function(Model) {
		var Q = require('q');
		
		function createPhoto(_photoInfo, _callback) {
			var cloud = this.config.Cloud;
			var TAP = Ti.App.Properties;

			var deferred = Q.defer();

			// bad data so return to caller
			if (!_photoInfo) {
				_callback && _callback({
					success : false,
					model : null
				});
			} else {
				cloud.Photos.create(_photoInfo, function(e) {
					if (e.success) {
						var photo = e.photos[0];
						TAP.setString("event", JSON.stringify(photo));
						// callback with newly created event
						var newModel = new model(photo);
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
		
		function getPhoto(_photoInfo, _callback) {
			var cloud = this.config.Cloud;
			var TAP = Ti.App.Properties;

			var deferred = Q.defer();

			// bad data so return to caller
			if (!_photoInfo) {
				_callback && _callback({
					success : false,
					model : null
				});
			} else {
				cloud.Photos.query(_photoInfo, function(e) {
					if (e.success) {
							var photo = e.photos[0];
							TAP.setString("event", JSON.stringify(photo));
							// callback with newly created event
							var newModel = new model(photo);
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
			createPhoto: createPhoto,
			getPhoto: getPhoto
		});
		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {});
		return Collection;
	}
};