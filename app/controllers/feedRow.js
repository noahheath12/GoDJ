var model = arguments[0] || {};

$.eventLabel.text = model.attributes.name;

var moment= require('moment');
var eventTime = moment(model.attributes.start_time, moment.ISO_8601);
var time = eventTime.format("dddd, MMMM Do YYYY, h:mm");
$.eventTimeLabel.text = time;
$.eventAddressLabel.text = model.attributes.custom_fields.address;
$.eventDescription.text = model.attributes.custom_fields.description;
