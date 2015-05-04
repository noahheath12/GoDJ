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
		user: Alloy.Globals.CURRENT_USER,
	};
	var aEvent = Alloy.createModel("Event", params);
	aEvent.save({}, {
		success: function(_model, _respone){
			Ti.API.info('success: ' + _model.toJSON());
		},
		error: function(e) {
			alert("Must enter an event name");
		}
	});
});


function loadEvents(ID){
	var rows = [];
	
	var events = Alloy.Collections.event || Alloy.Collections.instance("Event");
	events.fetch({
		data: {
			order: '-created_at',
			where: {
				user_id : ID
			}
		}, 
		success: function(model, response){
			events.each(function(event){
				var eventRow = Alloy.createController("feedRow", event);
				rows.push(eventRow.getView());
			});
			$.myEvents.data = rows;
		},
		error: function(error) {
			alert('Error loading Feed ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

var hint = "Type your profile description here";
hintText(hint);
$.descriptionArea.addEventListener('focus', function(e) {
if ($.descriptionArea.value == hint){
       $.descriptionArea.setValue("");
       $.descriptionArea.setColor("#000");
    }
});
 
 
$.descriptionArea.addEventListener('blur', function(e) {
    hintText(hint);
});
 
function hintText(hint) {   
    if ($.descriptionArea.value.length == 0) {
    // set the color to lighter color
    $.descriptionArea.setColor("#ccc");
        $.descriptionArea.setValue(hint);
    }
}


OS_IOS && $.cameraButton.addEventListener("click", function(_event){
	$.cameraButtonClicked(_event);
});
var media; 
//When the camera button is clicked, call photoSource
$.cameraButtonClicked= function(_event){
	var opts = {
      cancel: 2,
      options: ['Take Photo', 'Choose from gallery', 'Cancel'],
      destructive: 0,
      title: 'Choose'
    };

    var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(event){
		if(event.index == 0){
			Titanium.Media.showCamera({
				success: function(photoEvent) {
				//call to function to process an image from the photo gallery
					media = photoEvent.media;
					$.image.image = photoEvent.media;
					alert("Must press update button to save profile image");
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
		}
		else if(event.index == 1){
			Titanium.Media.openPhotoGallery({
				success: function(photoEvent) {
				//call to function to process an image from the photo gallery
					media = photoEvent.media;
					$.image.image = photoEvent.media;
					alert("Must press update button to save profile image");
				},
				cancel: function() {
				//called when user cancels taking a picture
				},
				error: function(error) {
						alert("Unexpected error: " + error.code);
				},
				//do not save to photo gallery. camera currently does not open
				allowEditing : true,
				mediaType: [Ti.Media.MEDIA_TYPE_PHOTO]
			});
		}
	});
	dialog.show();
};

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
  aPhoto.save();
}

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

function updateProfile(){
	var Cloud = require('ti.cloud');
	if(media == [Ti.Media.MEDIA_TYPE_PHOTO]){
		processImage(media);
	}
	var param = {
		custom_fields: {
			"description": $.descriptionArea.value
			}
	};
	aUser.updateAccount(param).then(function(model){
		$.descriptionText.text = model.attributes.custom_fields.description;	
	});
	
}

function loadProfileInformation() {
   var photoId;
   var Cloud = require('ti.cloud');
   var myPhoto = Alloy.createModel('Photo');
   var userID = Alloy.Globals.CURRENT_USER.attributes.id;
   var profile = Alloy.Globals.CURRENT_USER.attributes.username;
   var text = Alloy.Globals.CURRENT_USER.attributes.custom_fields.description;
   $.profileName.text = profile.toUpperCase();
   $.descriptionText.text = text;
   var param = {
   		where: {
   				'user_id': userID	
   		},
   		order: "-created_at",
   };
   
   var params = {
   		user_id: userID
   };
   
   loadEvents(userID);
  
   myPhoto.getPhoto(param).then(function(model){
   		photoId = model.attributes.id;
   		console.log(JSON.stringify(model));
   		//console.log(JSON.stringify(photoId));
   		if(userID != model.attributes.user_id){
   			$.image.image = '/missing.gif';
   		}
   		else{
   			myPhoto.showPhoto(photoId).then(function(_model){
   				console.log(JSON.stringify(_model));
   				$.image.image = _model.attributes.urls.thumb_100;
   			});
   		}
  });
  
}
$.getView().addEventListener("focus", function() {
  setTimeout(function() {
    !$.initialized && loadProfileInformation();
    $.initialized = true;
  }, 200);
});

