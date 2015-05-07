var model = arguments[0] || {};

var profile = JSON.stringify(model.attributes.username);
$.userLabel.text = model.attributes.username;

$.userRow.customObject = {
	userID: model.attributes.id 
};
