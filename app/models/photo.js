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
		
		function showPhoto(_photoInfo){
			var Q = require('q');
			var deferred = Q.defer();
			var cloud = this.config.Cloud;
			cloud.Photos.show({
		    photo_id: _photoInfo
			}, function (e) {
			    if (e.success) {
			         var photo = e.photos[0];
			         var newModel = new model(photo);
					 deferred.resolve(newModel);

			    } else {
			        deferred.reject(e);
			    }
			});
			return deferred.promise;
		}
		
		_.extend(Model.prototype, {
			showPhoto: showPhoto
		});
		return Model;
	},

	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {});
		return Collection;
	}
};