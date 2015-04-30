var args = arguments[0] || {};

$.image.image = args.image;
$.titleLabel.text = args.title || '';

OS_IOS && $.image.addEventListener("click", function(_event) {
	$.imageClicked(_event);
});

$.imageClicked = function(_event) {
	var photoSource = Titanium.Media.openPhotoGallery();

	photoSource({
		success : function(event) {
			//call to function to process an image from the photo gallery
			Ti.API.debug('Our type was: ' + event.mediaType);
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				var imageView = Ti.UI.createImageView({
					width : win.width,
					height : win.height,
					image : event.media
				});
				win.add(imageView);
			} else {
				alert("got the wrong type back =" + event.mediaType);
			}
		},
		cancel : function() {
			// called when user cancels taking a picture
		},
		error : function(error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery : true,
		// allowEditing and mediaTypes are iOS-only settings
		allowEditing : true,
		mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO]
	});
};
//function takes an event and returns a callback to an object that contains and image, title, and time stamp