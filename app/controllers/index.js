OS_IOS && $.addEventsButton.addEventListener("click", function(_event){
	Ti.API.debug('clicked: ' + _event.source.id);

	var animation = require('alloy/animation');

	// when move the create account screen into view
	var moveToTop = Ti.UI.createAnimation({
		top : '0dp',
		duration : 1
	});
	$.createEventView.animate(moveToTop, function() {

		// now cross fade
		animation.crossFade($.myEvents, $.createEventView, 500, function() {
			// when done animating, move the view off screen
			var moveToBottom = Ti.UI.createAnimation({
				top : '500dp',
				duration : 1
			});
			$.myEvents.animate(moveToBottom);
		});
	});
});

$.doCancelBtn.addEventListener("click", function(_event) {

	Ti.API.debug('clicked: ' + _event.source.id);

	var animation = require('alloy/animation');

	// when move the login screen into view
	var moveToTop = Ti.UI.createAnimation({
		top : '0dp',
		duration : 1
	});
	$.myEvents.animate(moveToTop, function() {

		// now cross fade
		animation.crossFade($.createEventView, $.myEvents, 500, function() {
			// when done animating, move the view off screen
			var moveToBottom = Ti.UI.createAnimation({
				top : '500dp',
				duration : 1
			});
			$.createEventView.animate(moveToBottom);
		});
	});
});

$.doCreateEventBtn.addEventListener("click", function(_event){
	var currentTime = new Date();
	
	var params = {
		name: $.event_name.value,
		start_time: currentTime,
		duration: 7200,
		user: Alloy.Globals.CURRENT_USER
	};
	var aEvent = Alloy.createModel("Event", params);
	aEvent.createEvent(params).then(function(_model){
	});
	
});



OS_IOS && $.cameraButton.addEventListener("click", function(_event){
	$.cameraButtonClicked(_event);
});

//When the camera button is clicked, call photoSource
$.cameraButtonClicked= function(_event){
	var photoSource = Titanium.Media.showCamera;
	
	photoSource ({
	success: function(event) {
		//call to function to process an image from the photo gallery
		processImage(event.media);
		
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
	saveToPhotoGallery: true,
	allowEditing : true,
	mediaType: [Ti.Media.MEDIA_TYPE_PHOTO]
});

function processImage(_mediaObject){
  $.currentUserCustomPhoto = _mediaObject;
  console.log(_mediaObject);
  var params = {
  	"photo" : $.currentUserCustomPhoto,
    "photo_sizes[thumb_100]" : "100x100#",
    // We need this since we are showing the image immediately
    "photo_sync_sizes[]" : "thumb_100",
    "photo_id": "554255f0c069eb7fa51b455f",
  };

  var aPhoto = Alloy.createModel('Photo', params);
  aPhoto.createPhoto(params).then(function(_model){
  });
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

function loadProfileInformation() {
   var Cloud = require('ti.cloud');
   var myPhoto;
  // get the attributes from the current use
   Cloud.Photos.query({
        order: "-created_at"
    },function (e) {
        if (e.success) {
            if (e.photos.length == 0) {
                // no photos
                alert('There are no photos');
            }
            else {
                e.photos.forEach(function(item){
                        myPhoto=item.processed?item.urls.thumb_100:tempPhoto;
                });
            }
        }
        else {
            alert(e.message);
        }
    });  
    
    $.image.image = myPhoto;

}

$.getView().addEventListener("focus", function() {
  setTimeout(function() {
    !$.initialized && loadProfileInformation();
    $.initialized = true;
  }, 200);
});

