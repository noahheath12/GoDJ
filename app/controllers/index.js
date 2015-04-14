
OS_IOS && $.cameraButton.addEventListener("click", function(_event){
	$.cameraButtonClicked(_event);
});
//When the camera button is clicked, call photoSource
$.cameraButtonClicked= function(_event){
	var photoSource = Titanium.Media.getIsCameraSupported() ?
//if true, show the camera and open the photo gallery
	Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;
	
	photoSource ({
	success: function(event) {
		//call to function to process an image from the photo gallery
		processImage(event.media, function(photoResp){
			//
			var row = Alloy.createController("feedRow", photoResp);
			//if the length of the length of the table = 0, set the data and append it to the row
			//feedTable is contained in the TableView tag in feed.xml
			if($.feedTable.getData().length === 0) {
				$.feedTable.setData([]);
				$.feedTable.appendRow(row.getView(), true);
			}else{
				$.feedTable.insertRowBefore(0, row.getView(), true);
			}
		});
	},
	cancel: function() {
		//called when user cancels taking a picture
	},
	error: function(error) {
		if(error.code == Titanium.Media.NO_CAMERA){
			alert("Please run this test on device");
		}else{
			alert("Unexpected error: " + error.code);
		}
	},
	//do not save to photo gallery. camera currently does not open
	saveToPhotoGallery: false,
	allowEditing : true,
	mediaType: [Ti.Media.MEDIA_TYPE_PHOTO]
});

function processImage(_mediaObject, _callback){
	var photoObject = {
		image: _mediaObject,
		title: "Sample Photo " + new Date()
	};
	_callback(photoObject);
}
};


// check if there is a user session saved already
var aUser = Alloy.createModel('User');
if (aUser.authenticated()) {
	// rehydrate the user
	aUser.showMe().then(function(_user) {
		userLoggedIn(_user);
	}, function(_error) {
		alert("Application Error\n " + _response.error.message);
		Ti.API.error(JSON.stringify(_response.error, null, 2));
		// go ahead and do the login
		userNotLoggedIn();
	});
} else {
	userNotLoggedIn();
}

/**
 * 
 */
function userLoggedIn(_user) {
		
	if ( !$.alreadyOpenedIndex ) {
		// start the application
		$.tabGroup.open();
		
		$.alreadyOpenedIndex = true;
	}
	
	Alloy.Globals.CURRENT_USER = _user;
	
	// set button title with name to show we are logged in
	$.logoutBtn.title = "Logout";


	// added support for getting location from the user
	// object since it seems like a helpful feature
	_user.getCurrentLocation().then(function(_results) {
		Ti.API.debug('_results ' + JSON.stringify(_results, null, 2));
	}, function(_error) {
		Ti.API.error('_error ' + JSON.stringify(_error));
	});
	
}
/**
 *
 */
function userNotLoggedIn() {
	// display login information
	var ctrl = Alloy.createController('User', {
		callback : function(_user) {
			
			userLoggedIn(_user);
			
			// close the old window
			ctrl.getView().close();
			ctrl = nil;
		}
	});

	ctrl.getView().open();
}

/**
 * 
 */
function doLogout() {
	if (Alloy.Globals.CURRENT_USER) {
		Alloy.Globals.CURRENT_USER.logout().then(function(_model){
			Alloy.Globals.CURRENT_USER = null;
			console.log("logged out!");
			
			// display login window
			userNotLoggedIn();
			
		}, function(_error){
			alert(_error.message);
		});
	}
}

