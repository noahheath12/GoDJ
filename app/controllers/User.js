var args = arguments[0] || {};
// function to call after login or user created
var callback = args.callback;
/**
 *
 */
$.appImage.image = '/turntable.png';



function handleLoginClick(_event) {

	Ti.API.debug('clicked: ' + _event.source.id);

	var aUser = Alloy.createModel('User');
	aUser.login($.login_email.value, $.login_password.value).then(function(_model) {
		// Do stuff after successful login.
		Alloy.Globals.loggedIn = true;
		Alloy.Globals.CURRENT_USER = _model;
		callback && callback(_model);
	}, function(_error) {
		var errorMsg = JSON.stringify(_error);
		alert(_error.message);
		Ti.API.error('Error: ' + errorMsg);
	});
}

/**
 *
 */
function handleShowAcctClick(_event) {

	Ti.API.debug('clicked: ' + _event.source.id);

	var animation = require('alloy/animation');

	// when move the create account screen into view
	var moveToTop = Ti.UI.createAnimation({
		top : '0dp',
		duration : 1
	});
	$.createAcctView.animate(moveToTop, function() {

		// now cross fade
		animation.crossFade($.loginAcctView, $.createAcctView, 500, function() {
			// when done animating, move the view off screen
			var moveToBottom = Ti.UI.createAnimation({
				top : '500dp',
				duration : 1
			});
			$.loginAcctView.animate(moveToBottom);
		});
	});
}

OS_IOS && $.addProfilePhoto.addEventListener("click", function(_event){
	$.profileButtonClicked(_event);
});
var media;

$.profileButtonClicked= function(_event){
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

/**
 *
 */
function handleCreateAccountClick() {
	if ($.acct_password.value !== $.acct_password_confirmation.value) {
		alert("Please re-enter information");
		return;
	}
	var params = {
		first_name : $.acct_fname.value,
		last_name : $.acct_lname.value,
		username : $.acct_username.value,
		email : $.acct_email.value,
		password : $.acct_password.value,
		password_confirmation : $.acct_password_confirmation.value,
		photo: media,
		custom_fields : '{
			"description": "Go to settings to enter a description."
		}'
	};
	
	var user = Alloy.createModel('User');
	user.createAccount(params).then(function(_model) {
		// Do stuff after successful creation of user.
		Alloy.Globals.loggedIn = true;
		Alloy.Globals.CURRENT_USER = _model;
		callback && callback(_model);
	}, function(_error) {
		var errorMsg = JSON.stringify(_error);
		alert(_error.message);
		Ti.API.error('Error: ' + errorMsg);
	});
};

/**
 *
 * @param {Object} _event
 */
function handleShowLoginClick(_event) {

	Ti.API.debug('clicked: ' + _event.source.id);

	var animation = require('alloy/animation');

	// when move the login screen into view
	var moveToTop = Ti.UI.createAnimation({
		top : '0dp',
		duration : 1
	});
	$.loginAcctView.animate(moveToTop, function() {

		// now cross fade
		animation.crossFade($.createAcctView, $.loginAcctView, 500, function() {
			// when done animating, move the view off screen
			var moveToBottom = Ti.UI.createAnimation({
				top : '500dp',
				duration : 1
			});
			$.createAcctView.animate(moveToBottom);
		});
	});
}

